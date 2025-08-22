import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = `
      SELECT id, account_type, username, expire_date, is_active, created_at
      FROM vpn_accounts
      WHERE vps_id = 1
    `;
    
    const params = [];
    if (type) {
      query += ` AND account_type = $1`;
      params.push(type);
    }
    
    query += ` ORDER BY created_at DESC`;

    const accounts = await sql(query, params);

    return Response.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return Response.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { account_type, username, password, expire_days = 30 } = await request.json();

    if (!account_type || !username) {
      return Response.json({ error: "Account type and username are required" }, { status: 400 });
    }

    // Calculate expire date
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expire_days);

    // Generate config based on account type
    let configData = '';
    if (account_type === 'vmess') {
      configData = JSON.stringify({
        uuid: crypto.randomUUID(),
        alterId: 0,
        security: 'auto'
      });
    } else if (account_type === 'vless') {
      configData = JSON.stringify({
        uuid: crypto.randomUUID(),
        flow: 'xtls-rprx-direct'
      });
    } else if (account_type === 'trojan') {
      configData = JSON.stringify({
        password: password || crypto.randomUUID().replace(/-/g, '').substring(0, 32)
      });
    }

    const [newAccount] = await sql`
      INSERT INTO vpn_accounts (vps_id, account_type, username, password, config_data, expire_date)
      VALUES (1, ${account_type}, ${username}, ${password || ''}, ${configData}, ${expireDate.toISOString().split('T')[0]})
      RETURNING *
    `;

    return Response.json(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    return Response.json({ error: "Failed to create account" }, { status: 500 });
  }
}