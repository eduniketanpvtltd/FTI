import { NextResponse } from 'next/server';
import { getSupabaseAdmin, supabase, isSupabaseConfigured } from '@/lib/supabase';
import { UserProfile, UserAddress, BusinessType, UserRole } from '@/types';

const VALID_BUSINESS_TYPES: BusinessType[] = [
  'Manufacturer',
  'Wholesaler',
  'Fabricator',
  'Contractor',
  'Trader',
  'Other',
];

function mapRowToProfile(row: any): UserProfile {
  const companyName = row.company_name || '';
  const mobile = row.mobile || '';
  const isComplete = Boolean(
    companyName.trim() &&
      companyName !== 'Pending Setup' &&
      mobile.trim() &&
      mobile !== 'Pending'
  );

  return {
    id: row.id,
    firebaseUid: row.firebase_uid || undefined,
    fullName: row.full_name || '',
    email: row.email || '',
    mobile: row.mobile || '',
    companyName: row.company_name || '',
    gstin: row.gstin || '',
    businessType: (VALID_BUSINESS_TYPES.includes(row.business_type)
      ? row.business_type
      : 'Manufacturer') as BusinessType,
    role: (row.role || 'customer') as UserRole,
    isActive: row.is_active !== false,
    isProfileComplete: isComplete,
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapRowToAddress(row: any): UserAddress {
  return {
    id: row.id,
    userId: row.user_id,
    addressType: (row.address_type || 'both') as 'billing' | 'shipping' | 'both',
    isDefault: Boolean(row.is_default),
    recipientName: row.recipient_name || '',
    phone: row.phone || '',
    companyName: row.company_name || undefined,
    gstin: row.gstin || undefined,
    streetAddress: row.street_address || '',
    landmark: row.landmark || undefined,
    city: row.city || '',
    district: row.district || '',
    state: row.state || '',
    pincode: row.pincode || '',
    country: row.country || 'India',
  };
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, configured: false, found: false });
  }

  try {
    const client = getSupabaseAdmin() || supabase;
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all');
    const uid = searchParams.get('uid');
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');

    if (all === 'true') {
      const { data: rows, error } = await client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        profiles: (rows || []).map(mapRowToProfile),
      });
    }

    let profileRow: any = null;

    if (uid) {
      const { data } = await client
        .from('profiles')
        .select('*')
        .eq('firebase_uid', uid)
        .maybeSingle();
      if (data) profileRow = data;
    }

    if (!profileRow && email) {
      const { data } = await client
        .from('profiles')
        .select('*')
        .ilike('email', email.trim())
        .maybeSingle();
      if (data) profileRow = data;
    }

    if (!profileRow && userId) {
      const { data } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (data) profileRow = data;
    }

    if (!profileRow) {
      return NextResponse.json({ success: true, found: false });
    }

    const mappedProfile = mapRowToProfile(profileRow);

    const { data: addrRows } = await client
      .from('user_addresses')
      .select('*')
      .eq('user_id', mappedProfile.id)
      .order('created_at', { ascending: false });

    const addresses = (addrRows || []).map(mapRowToAddress);

    return NextResponse.json({
      success: true,
      found: true,
      profile: mappedProfile,
      addresses,
    });
  } catch (err: any) {
    console.warn('GET /api/auth/profile error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, configured: false });
  }

  try {
    const client = getSupabaseAdmin() || supabase;
    const body = await request.json();
    const profile: UserProfile | undefined = body.profile;
    const address: UserAddress | undefined = body.address;

    let savedProfileId = profile?.id;

    if (profile && profile.email) {
      // Check if profile already exists by firebase_uid, email, or id
      let existing: any = null;

      if (profile.firebaseUid) {
        const { data } = await client
          .from('profiles')
          .select('*')
          .eq('firebase_uid', profile.firebaseUid)
          .maybeSingle();
        if (data) existing = data;
      }

      if (!existing) {
        const { data } = await client
          .from('profiles')
          .select('*')
          .ilike('email', profile.email.trim())
          .maybeSingle();
        if (data) existing = data;
      }

      if (!existing && profile.id) {
        const { data } = await client
          .from('profiles')
          .select('*')
          .eq('id', profile.id)
          .maybeSingle();
        if (data) existing = data;
      }

      const validBusinessType: BusinessType = VALID_BUSINESS_TYPES.includes(profile.businessType)
        ? profile.businessType
        : 'Manufacturer';

      if (existing) {
        savedProfileId = existing.id;
        await client
          .from('profiles')
          .update({
            firebase_uid: profile.firebaseUid || existing.firebase_uid || null,
            full_name: profile.fullName || existing.full_name,
            email: profile.email.trim().toLowerCase(),
            mobile: profile.mobile || existing.mobile || '',
            company_name: profile.companyName || existing.company_name || '',
            gstin: profile.gstin ?? existing.gstin ?? '',
            business_type: validBusinessType,
            role: profile.role || existing.role || 'customer',
            is_active: true,
            avatar_url: profile.avatarUrl || existing.avatar_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        const newId = profile.id || `usr-${Date.now()}`;
        savedProfileId = newId;
        await client.from('profiles').insert({
          id: newId,
          firebase_uid: profile.firebaseUid || null,
          full_name: profile.fullName,
          email: profile.email.trim().toLowerCase(),
          mobile: profile.mobile || '',
          company_name: profile.companyName || '',
          gstin: profile.gstin || '',
          business_type: validBusinessType,
          role: profile.role || 'customer',
          is_active: true,
          avatar_url: profile.avatarUrl || null,
          created_at: profile.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (address && savedProfileId) {
      const addrId = address.id || `addr-${Date.now()}`;
      const { data: existingAddr } = await client
        .from('user_addresses')
        .select('id')
        .eq('id', addrId)
        .maybeSingle();

      if (address.isDefault) {
        await client
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', savedProfileId);
      }

      if (existingAddr) {
        await client
          .from('user_addresses')
          .update({
            address_type: address.addressType || 'both',
            is_default: Boolean(address.isDefault),
            recipient_name: address.recipientName,
            phone: address.phone,
            company_name: address.companyName || null,
            gstin: address.gstin || null,
            street_address: address.streetAddress,
            landmark: address.landmark || null,
            city: address.city,
            district: address.district,
            state: address.state,
            pincode: address.pincode,
            country: address.country || 'India',
          })
          .eq('id', addrId);
      } else {
        await client.from('user_addresses').insert({
          id: addrId,
          user_id: savedProfileId,
          address_type: address.addressType || 'both',
          is_default: Boolean(address.isDefault),
          recipient_name: address.recipientName,
          phone: address.phone,
          company_name: address.companyName || null,
          gstin: address.gstin || null,
          street_address: address.streetAddress,
          landmark: address.landmark || null,
          city: address.city,
          district: address.district,
          state: address.state,
          pincode: address.pincode,
          country: address.country || 'India',
        });
      }
    }

    return NextResponse.json({
      success: true,
      profileId: savedProfileId,
    });
  } catch (err: any) {
    console.warn('POST /api/auth/profile error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save profile' },
      { status: 500 }
    );
  }
}
