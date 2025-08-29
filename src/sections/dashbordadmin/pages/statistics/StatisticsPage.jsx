import { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";

const PaginatedTable = ({ data, apiEndpoint, nameKey, dataKey, title }) => {
  const { t } = useTranslation();
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

  // Determine the translation key for the title based on apiEndpoint
  const getTitleKey = () => {
    if (apiEndpoint.includes("villages")) return "distribution_by_village_town";
    if (apiEndpoint.includes("councils")) return "distribution_by_council";
    if (apiEndpoint.includes("communes")) return "distribution_by_commune";
    return title; // Fallback
  };

  // Determine the translation key for the name column based on apiEndpoint
  const getNameKey = () => {
    if (apiEndpoint.includes("villages")) return "name_village_town";
    if (apiEndpoint.includes("councils")) return "name_council";
    if (apiEndpoint.includes("communes")) return "name_commune";
    return "name"; // Fallback
  };

  return (
    <div className="chart-card">
      <h3>{t(getTitleKey())}</h3>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={t("search")}
        className="search-input"
      />
      <table className="paginated-table h12">
        <thead>
          <tr>
            <th>{t(getNameKey())}</th>
            <th>{t("total_members")}</th>
            <th>{t("total_families")}</th>
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
          {t("previous")}
        </button>
        <span>
          {t("page_of", { currentPage, totalPages: totalPages || 1 })}
        </span>
        <button onClick={handleNext} disabled={nextDisabled}>
          {t("next")}
        </button>
      </div>
    </div>
  );
};

const StatisticsPage = () => {
  const { t } = useTranslation();
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

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (!stats) return null;

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="statistics-container">
      <h1 className="h11">{t("general_statistics")}</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{t("total_families")}</h3>
          <p className="stat-number">{stats.total_families}</p>
        </div>
        <div className="stat-card">
          <h3>{t("total_members")}</h3>
          <p className="stat-number">{stats.members_total}</p>
        </div>
        <div className="stat-card">
          <h3>{t("total_trees")}</h3>
          <p className="stat-number">{stats.trees_total}</p>
        </div>
        <div className="stat-card">
          <h3>{t("total_buildings")}</h3>
          <p className="stat-number">{stats.buildings_total}</p>
        </div>
        <div className="stat-card">
          <h3>{t("total_sheep")}</h3>
          <p className="stat-number">{stats.sheep_total}</p>
        </div>
        <div className="stat-card">
          <h3>{t("total_cows")}</h3>
          <p className="stat-number">{stats.cows_total}</p>
        </div>
      </div>

      <div className="charts-grid">
        <PaginatedTable
          apiEndpoint="/villages/statistics/"
          nameKey="village_town__name"
          dataKey="total_members"
          title="distribution_by_village_town"
        />

        <PaginatedTable
          apiEndpoint="/councils/statistics/"
          nameKey="council__name"
          dataKey="total_members"
          title="distribution_by_council"
        />

        <PaginatedTable
          apiEndpoint="/communes/statistics/"
          nameKey="commune__name"
          dataKey="total_members"
          title="distribution_by_commune"
        />

        <div className="chart-card">
          <h3>{t("distribution_by_city")}</h3>
          <BarChart width={400} height={300} data={stats.by_city}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="city__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3b82f6" name={t("count")} />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>{t("distribution_by_ethnic_component")}</h3>
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
          <h3>{t("distribution_by_religion")}</h3>
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
          <h3>{t("distribution_by_housing_type")}</h3>
          <BarChart width={400} height={300} data={stats.by_housing_type}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="housing_type__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#f59e0b" name={t("count")} />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>{t("distribution_by_housing_ownership")}</h3>
          <BarChart width={400} height={300} data={stats.by_housing_ownership}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="housing_ownership__name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#ef4444" name={t("count")} />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>{t("distribution_by_economic_status")}</h3>
          <BarChart width={400} height={300} data={stats.by_economic_status}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="economic_status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8b5cf6" name={t("count")} />
          </BarChart>
        </div>

        <div className="chart-card">
          <h3>{t("distribution_by_residence_status")}</h3>
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
          <h3>{t("land_statistics")}</h3>
          <BarChart
            width={400}
            height={300}
            data={[
              {
                name: t("rainfed_land"),
                value: stats.land_stats.total_rainfed,
              },
              {
                name: t("irrigated_land"),
                value: stats.land_stats.total_irrigated,
              },
              {
                name: t("total_land"),
                value: stats.land_stats.total_land,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8b5cf6" name={t("value")} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
