import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const services = await sql`
      SELECT service_name, service_status, port
      FROM services
      WHERE vps_id = 1
      ORDER BY service_name
    `;

    return Response.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { service_name, action } = await request.json();

    if (!service_name || !action) {
      return Response.json({ error: "Service name and action are required" }, { status: 400 });
    }

    const validActions = ['start', 'stop', 'restart'];
    if (!validActions.includes(action)) {
      return Response.json({ error: "Invalid action. Must be start, stop, or restart" }, { status: 400 });
    }

    const newStatus = action === 'stop' ? 'OFF' : 'ON';

    // Update service status
    const [updatedService] = await sql`
      UPDATE services 
      SET service_status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE vps_id = 1 AND service_name = ${service_name}
      RETURNING *
    `;

    if (!updatedService) {
      return Response.json({ error: "Service not found" }, { status: 404 });
    }

    return Response.json({
      service_name: updatedService.service_name,
      service_status: updatedService.service_status,
      action: action,
      message: `Service ${service_name} ${action}ed successfully`
    });
  } catch (error) {
    console.error('Error managing service:', error);
    return Response.json({ error: "Failed to manage service" }, { status: 500 });
  }
}