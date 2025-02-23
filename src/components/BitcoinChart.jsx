import { Line, LineChart, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

function BitcoinChart({ data, deadline }) {
  const currentDate = new Date();
  
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
        />
        <YAxis
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        <Tooltip
          labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
        />
        <ReferenceLine
          x={currentDate}
          stroke="#666"
          strokeDasharray="3 3"
          label="Today"
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke="#2563eb"
          dot={false}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default BitcoinChart;