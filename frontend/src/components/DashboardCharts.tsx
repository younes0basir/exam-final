import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => (
  <div className={`glass-card rounded-2xl p-6 ${className}`}>
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// Grade Distribution Pie Chart
export const GradeDistributionChart: React.FC<{
  data: { excellent: number; good: number; average: number; fail: number };
}> = ({ data }) => {
  const chartData = [
    { name: 'Excellent (16-20)', value: data.excellent, color: '#10b981' },
    { name: 'Good (12-15.99)', value: data.good, color: '#3b82f6' },
    { name: 'Average (10-11.99)', value: data.average, color: '#f59e0b' },
    { name: 'Fail (0-9.99)', value: data.fail, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Grade Distribution">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} students`, 'Count']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600">Excellent: {data.excellent}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-600">Good: {data.good}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Average: {data.average}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Fail: {data.fail}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Total Students with Grades: <span className="font-bold text-gray-800">{total}</span>
        </p>
      </div>
    </ChartCard>
  );
};

// Absences by Month Bar Chart
export const AbsencesByMonthChart: React.FC<{
  data: Array<{ month: string; count: number }>;
}> = ({ data }) => {
  return (
    <ChartCard title="Absenteeism Trend (Last 6 Months)">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        Total Absences: <span className="font-bold text-gray-800">
          {data.reduce((sum, item) => sum + item.count, 0)}
        </span>
      </div>
    </ChartCard>
  );
};

// Attendance Rate Trend Line Chart
export const AttendanceTrendChart: React.FC<{
  data: Array<{ date: string; rate: number }>;
}> = ({ data }) => {
  return (
    <ChartCard title="Attendance Rate Trend (Last 30 Days)">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval={4}
            />
            <YAxis 
              stroke="#6b7280"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Attendance Rate']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <div className="text-gray-600">
          Average: <span className="font-bold text-gray-800">
            {(data.reduce((sum, item) => sum + item.rate, 0) / data.length).toFixed(1)}%
          </span>
        </div>
        <div className="text-gray-600">
          Lowest: <span className="font-bold text-gray-800">
            {Math.min(...data.map(d => d.rate)).toFixed(1)}%
          </span>
        </div>
        <div className="text-gray-600">
          Highest: <span className="font-bold text-gray-800">
            {Math.max(...data.map(d => d.rate)).toFixed(1)}%
          </span>
        </div>
      </div>
    </ChartCard>
  );
};

// Module Averages Bar Chart
export const ModuleAveragesChart: React.FC<{
  data: Array<{ module: string; average: number }>;
}> = ({ data }) => {
  const getColor = (average: number) => {
    if (average >= 16) return '#10b981';
    if (average >= 12) return '#3b82f6';
    if (average >= 10) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ChartCard title="Average Grades by Module">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 20]} stroke="#6b7280" />
            <YAxis 
              dataKey="module" 
              type="category" 
              stroke="#6b7280"
              width={150}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(2)}/20`, 'Average']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="average" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.average)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500"></div>
          <span className="text-gray-600">≥16</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-gray-600">12-15.99</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500"></div>
          <span className="text-gray-600">10-11.99</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span className="text-gray-600">&lt;10</span>
        </div>
      </div>
    </ChartCard>
  );
};

// Absence Status Pie Chart
export const AbsenceStatusChart: React.FC<{
  data: { justified: number; unjustified: number };
}> = ({ data }) => {
  const chartData = [
    { name: 'Justified', value: data.justified, color: '#10b981' },
    { name: 'Unjustified', value: data.unjustified, color: '#ef4444' },
  ].filter(item => item.value > 0);

  const total = data.justified + data.unjustified;
  const justifiedPercentage = total > 0 ? ((data.justified / total) * 100).toFixed(1) : '0';

  return (
    <ChartCard title="Absence Justification Status">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Justification Rate: <span className="font-bold text-emerald-600">{justifiedPercentage}%</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Total Absences: {total}
        </p>
      </div>
    </ChartCard>
  );
};

// Students per Filiere Bar Chart
export const StudentsPerFiliereChart: React.FC<{
  data: Array<{ filiere: string; students: number }>;
}> = ({ data }) => {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <ChartCard title="Students Distribution by Filiere">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="filiere" stroke="#6b7280" tick={{ fontSize: 11 }} />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="students" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center text-sm text-gray-600">
        Total Students: <span className="font-bold text-gray-800">
          {data.reduce((sum, item) => sum + item.students, 0)}
        </span>
      </div>
    </ChartCard>
  );
};
