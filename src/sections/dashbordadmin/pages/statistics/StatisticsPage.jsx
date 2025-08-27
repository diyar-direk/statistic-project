import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./StatisticsPage.css";
import axiosInstance from "../../../../utils/axios";

const PaginatedTable = ({ data, apiEndpoint, nameKey, dataKey, title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [nextLink, setNext] = useState(null);
  const pageSize = 4; // Consistent with villages pagination

  useEffect(() => {
    if (apiEndpoint) {
      const fetchData = async () => {
        const url = `${apiEndpoint}?page=${currentPage}&page_size=${pageSize}${
          searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ""
        }`;
        try {
          const response = await axiosInstance.get(url);
          setResults(response.data.results);
          setCount(response.data.count);
          setPrevious(response.data.previous);
          setNext(response.data.next);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [apiEndpoint, currentPage, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  let paginatedData = [];
  let totalPages = 0;

  if (!apiEndpoint) {
    // Client-side pagination
    const filteredData = data.filter((entry) =>
      entry[nameKey].toLowerCase().includes(searchTerm.toLowerCase())
    );
    totalPages = Math.ceil(filteredData.length / pageSize);
    const start = (currentPage - 1) * pageSize;
    paginatedData = filteredData.slice(start, start + pageSize);
  } else {
    // Server-side pagination
    paginatedData = results;
    totalPages = Math.ceil(count / pageSize);
  }

  const handlePrev = () => {
    if (apiEndpoint) {
      if (previous) setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage((p) => Math.max(1, p - 1));
    }
  };

  const handleNext = () => {
    if (apiEndpoint) {
      if (nextLink) setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage((p) => Math.min(totalPages, p + 1));
    }
  };

  const prevDisabled = apiEndpoint ? !previous : currentPage === 1;
  const nextDisabled = apiEndpoint ? !nextLink : currentPage >= totalPages;

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="بحث..."
        className="search-input"
      />
      <table className="paginated-table h12 ">
        <thead>
          <tr>
            <th>اسم {title.split("حسب ")[1]}</th>
            <th>عدد الأفراد</th>
            <th>عدد العائلات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((entry, index) => (
            <tr key={`row-${index}`}>
              <td>{entry[nameKey]}</td>
              <td>{entry[dataKey]}</td>
              <td>{entry.total_families}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrev} disabled={prevDisabled}>
          السابق
        </button>
        <span>
          صفحة {currentPage} من {totalPages || 1}
        </span>
        <button onClick={handleNext} disabled={nextDisabled}>
          التالي
        </button>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("family-forms/statistics/");
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (!stats) return null;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="statistics-container">
      <h1 className="h11">إحصائيات عامة</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>إجمالي العائلات</h3>
          <p className="stat-number">{stats.total_families}</p>
        </div>
        <div className="stat-card">
          <h3>إجمالي الأفراد</h3>
          <p className="stat-number">{stats.members_total}</p>
        </div>
        <div className="stat-card">
          <h3>إجمالي الأشجار</h3>
          <p className="stat-number">{stats.trees_total}</p>
        </div>
        <div className="stat-card">
          <h3>إجمالي المباني</h3>
          <p className="stat-number">{stats.buildings_total}</p>
        </div>
        <div className="stat-card">
          <h3>إجمالي الأغنام</h3>
          <p className="stat-number">{stats.sheep_total}</p>
        </div>
        <div className="stat-card">
          <h3>إجمالي الأبقار</h3>
          <p className="stat-number">{stats.cows_total}</p>
        </div>
      </div>

      <div className="charts-grid">
        <PaginatedTable
          apiEndpoint="/villages/statistics/"
          nameKey="village_town__name"
          dataKey="total_members"
          title="التوزيع حسب القرية/البلدة"
        />

        <PaginatedTable
          apiEndpoint="/councils/statistics/"
          nameKey="council__name"
          dataKey="total_members"
          title="التوزيع حسب المجلس"
        />

        <PaginatedTable
          apiEndpoint="/communes/statistics/"
          nameKey="commune__name"
          dataKey="total_members"
          title="التوزيع حسب الكومين"
        />
        <div className="chart-card">
          <h3>توزيع العائلات حسب المدينة</h3>
          <BarChart width={400} height={300} data={stats.by_city}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name="العدد" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>التوزيع حسب المكون العرقي</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.by_ethnic_component}
              dataKey="total"
              nameKey="ethnic_component__name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.by_ethnic_component.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="chart-card">
          <h3>التوزيع حسب الديانة</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.by_religion}
              dataKey="total"
              nameKey="religion__name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.by_religion.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="chart-card">
          <h3>التوزيع حسب نوع السكن</h3>
          <BarChart width={400} height={300} data={stats.by_housing_type}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="housing_type__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#f59e0b" name="العدد" />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>التوزيع حسب ملكية السكن</h3>
          <BarChart width={400} height={300} data={stats.by_housing_ownership}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="housing_ownership__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#ef4444" name="العدد" />
          </BarChart>
        </div>
        <div className="chart-card">
          <h3>التوزيع حسب الحالة الاقتصادية</h3>
          <BarChart width={400} height={300} data={stats.by_economic_status}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="economic_status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8b5cf6" name="العدد" />
          </BarChart>
        </div>
        <div className="chart-card">
          <h3>التوزيع حسب حالة الإقامة</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.by_residence_status}
              dataKey="total"
              nameKey="residence_status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.by_residence_status.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="chart-card">
          <h3>التوزيع حسب عدد الأفراد</h3>
          <BarChart width={400} height={300} data={stats.by_members_count}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="members_count" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name="العدد" />
          </BarChart>
        </div>
        <div className="chart-card">
          <h3>إحصائيات الأراضي</h3>
          <BarChart
            width={400}
            height={300}
            data={[
              {
                name: "الأراضي البعلية",
                value: stats.land_stats.total_rainfed,
              },
              {
                name: "الأراضي المروية",
                value: stats.land_stats.total_irrigated,
              },
              { name: "إجمالي الأراضي", value: stats.land_stats.total_land },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8b5cf6" name="القيمة" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
