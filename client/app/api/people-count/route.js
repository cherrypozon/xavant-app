// In-memory storage for people count (resets on cold start)
let currentPoolOccupancy = 0;
let lastUpdated = null;

// GET - Returns dashboard data with current pool occupancy
export async function GET() {
  const dashboardData = {
    dashboard: [
      {
        "People Counter": {
          hotel_areas: [
            {
              pool: {
                name: "Pool",
                optimal_occupancy: 10,
                current_occupancy: currentPoolOccupancy,
                last_updated_time: lastUpdated
              }
            },
            {
              gym: {
                name: "Gym",
                optimal_occupancy: 30,
                current_occupancy: 25,
                last_updated_time: lastUpdated
              }
            },
            {
              restaurant: {
                name: "Restaurant",
                optimal_occupancy: 50,
                current_occupancy: 40,
                last_updated_time: lastUpdated
              }
            }
          ]
        }
      }
    ]
  };

  return Response.json(dashboardData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

// POST - Updates pool occupancy from PeopleCounter client
export async function POST(request) {
  try {
    const body = await request.json();

    if (typeof body.count !== 'number') {
      return Response.json({
        success: false,
        error: 'count must be a number'
      }, {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    currentPoolOccupancy = body.count;
    lastUpdated = new Date().toISOString();

    console.log('[PeopleCount API] Pool occupancy updated:', currentPoolOccupancy, 'at', lastUpdated);

    return Response.json({
      success: true,
      current_occupancy: currentPoolOccupancy
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// OPTIONS - Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
