import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get system info and latest metrics
    const [systemData] = await sql`
      SELECT v.*, m.cpu_usage, m.ram_usage, m.uptime_seconds, m.recorded_at
      FROM vps_system v
      LEFT JOIN system_metrics m ON v.id = m.vps_id
      WHERE v.id = 1
      ORDER BY m.recorded_at DESC
      LIMIT 1
    `;

    if (!systemData) {
      return Response.json({ error: "System not found" }, { status: 404 });
    }

    // Get account counts by type
    const accountCounts = await sql`
      SELECT account_type, COUNT(*) as count
      FROM vpn_accounts
      WHERE vps_id = 1 AND is_active = true
      GROUP BY account_type
    `;

    // Get service statuses
    const services = await sql`
      SELECT service_name, service_status, port
      FROM services
      WHERE vps_id = 1
    `;

    // Format uptime
    const formatUptime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    };

    // Format response
    const response = {
      system: {
        os: systemData.os_name,
        cores: systemData.cpu_cores,
        ramUsed: systemData.ram_usage || 378,
        ramTotal: systemData.ram_total,
        cpuLoad: parseFloat(systemData.cpu_usage) || 1,
        uptime: formatUptime(systemData.uptime_seconds || 4980),
        ip: systemData.ip_address,
        domain: systemData.domain,
        lastUpdate: systemData.recorded_at
      },
      accounts: {
        ssh: accountCounts.find(a => a.account_type === 'ssh')?.count || 0,
        vmess: accountCounts.find(a => a.account_type === 'vmess')?.count || 0,
        vless: accountCounts.find(a => a.account_type === 'vless')?.count || 0,
        trojan: accountCounts.find(a => a.account_type === 'trojan')?.count || 0,
        shadowsocks: accountCounts.find(a => a.account_type === 'shadowsocks')?.count || 0
      },
      services: services.reduce((acc, service) => {
        acc[service.service_name] = {
          status: service.service_status,
          port: service.port
        };
        return acc;
      }, {})
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching system info:', error);
    return Response.json({ error: "Failed to fetch system info" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { cpu_usage, ram_usage, uptime_seconds, network_in, network_out } = await request.json();

    // Insert new metrics
    await sql`
      INSERT INTO system_metrics (vps_id, cpu_usage, ram_usage, uptime_seconds, network_in, network_out)
      VALUES (1, ${cpu_usage}, ${ram_usage}, ${uptime_seconds}, ${network_in || 0}, ${network_out || 0})
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error updating system metrics:', error);
    return Response.json({ error: "Failed to update system metrics" }, { status: 500 });
  }
}