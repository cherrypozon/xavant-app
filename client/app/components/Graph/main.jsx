import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function LineGraph({ data, xKey, yKey, color = "#85A3FF", height }) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.3} />
          <XAxis 
            dataKey={xKey} 
            stroke="#fffff"
            tick={{ fill: '#ffffff', fontSize: 10 }}
            axisLine={{ stroke: '#ffffff' }}
          />
          <YAxis 
            stroke="#ffffff"
            tick={{ fill: '#ffffff', fontSize: 10 }}
            axisLine={{ stroke: '#ffffff' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2d3748', 
              border: '1px solid #4a5568',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '8px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default LineGraph;