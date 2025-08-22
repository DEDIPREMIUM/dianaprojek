"use client";

import { useState, useEffect } from "react";
import {
  Server,
  Cpu,
  HardDrive,
  Clock,
  Globe,
  Shield,
  Settings,
  Activity,
  Users,
  RefreshCw,
  Terminal,
  Download,
  Upload,
  Zap,
  Menu,
  X,
  Phone,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function VPSManagerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemInfo, setSystemInfo] = useState({
    os: "Loading...",
    cores: 0,
    ramUsed: 0,
    ramTotal: 0,
    cpuLoad: 0,
    uptime: "Loading...",
    ip: "Loading...",
    domain: "Loading...",
  });

  const [services, setServices] = useState({});
  const [accounts, setAccounts] = useState({
    ssh: 0,
    vmess: 0,
    vless: 0,
    trojan: 0,
    shadowsocks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for charts
  const [cpuData, setCpuData] = useState([]);
  const [ramData, setRamData] = useState([]);
  const [bandwidthData, setBandwidthData] = useState([]);

  // Generate mock chart data
  const generateChartData = () => {
    const now = new Date();
    const cpuPoints = [];
    const ramPoints = [];
    const bandwidthPoints = [];

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 30 minutes of data
      const timeStr = time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      cpuPoints.push({
        time: timeStr,
        cpu: Math.floor(Math.random() * 40) + 20, // 20-60%
        temperature: Math.floor(Math.random() * 20) + 45, // 45-65°C
      });

      ramPoints.push({
        time: timeStr,
        used: Math.floor(Math.random() * 800) + 400, // 400-1200 MB
        available: 2048,
      });

      bandwidthPoints.push({
        time: timeStr,
        download: Math.floor(Math.random() * 50) + 10, // 10-60 Mbps
        upload: Math.floor(Math.random() * 20) + 5, // 5-25 Mbps
      });
    }

    setCpuData(cpuPoints);
    setRamData(ramPoints);
    setBandwidthData(bandwidthPoints);
  };

  // Fetch system information
  const fetchSystemInfo = async () => {
    try {
      const response = await fetch("/api/system/info");
      if (!response.ok) {
        throw new Error(`Failed to fetch system info: ${response.status}`);
      }
      const data = await response.json();

      setSystemInfo(data.system);
      setAccounts(data.accounts);

      // Convert services array to object format
      const servicesObj = {};
      Object.entries(data.services).forEach(([name, serviceData]) => {
        servicesObj[name] = {
          status: serviceData.status,
          port: serviceData.port,
        };
      });
      setServices(servicesObj);

      setError(null);
    } catch (err) {
      console.error("Error fetching system info:", err);
      setError("Gagal memuat informasi sistem");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
    generateChartData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSystemInfo();
      generateChartData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { title: "SSH MENU", icon: Terminal, category: "account" },
    { title: "VMESS MENU", icon: Shield, category: "account" },
    { title: "VLESS MENU", icon: Shield, category: "account" },
    { title: "TROJAN MENU", icon: Shield, category: "account" },
    { title: "AKUN NOOBZVPN", icon: Users, category: "account" },
    { title: "SS - LIBEV", icon: Shield, category: "account" },
    { title: "INSTALL UDP", icon: Download, category: "install" },
    { title: "BCKP/RSTR", icon: HardDrive, category: "system" },
    { title: "GOTOP X RAM", icon: Activity, category: "monitor" },
    { title: "RESTART ALL", icon: RefreshCw, category: "system" },
    { title: "TELE BOT", icon: Settings, category: "bot" },
    { title: "UPDATE MENU", icon: Upload, category: "system" },
    { title: "RUNNING", icon: Activity, category: "monitor" },
    { title: "INFO PORT", icon: Globe, category: "info" },
    { title: "MENU BOT", icon: Settings, category: "bot" },
    { title: "CHANGE DOMAIN", icon: Globe, category: "config" },
    { title: "FIX CRT DOMAIN", icon: Shield, category: "config" },
    { title: "CHANGE BANNER", icon: Settings, category: "config" },
    { title: "RESTART BANNER", icon: RefreshCw, category: "config" },
    { title: "SPEEDTEST", icon: Zap, category: "monitor" },
    { title: "EKSTRAK MENU", icon: Settings, category: "system" },
  ];

  const getServiceColor = (status) =>
    status === "ON" ? "text-green-400" : "text-red-400";
  const getServiceBg = (status) =>
    status === "ON" ? "bg-green-900/40" : "bg-red-900/40";

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Creator Info Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  NINA KURNIASIH BANJAR
                </h2>
                <p className="text-xs text-blue-200">
                  Web Developer & VPS Specialist
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
              <Phone size={16} className="text-green-400" />
              <a
                href="https://wa.me/6285723657734"
                target="_blank"
                className="text-sm font-medium text-white hover:text-green-400 transition-colors"
              >
                085723657734
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 relative mb-4">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <header className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-gray-800"
              >
                <Menu size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Server size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">VPS Manager</h1>
                  <p className="text-sm text-gray-400 hidden sm:block">
                    Dekengane Pusat Blitar
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  fetchSystemInfo();
                  generateChartData();
                }}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
                title="Refresh data"
              >
                <RefreshCw size={16} />
              </button>
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-white">
                  {systemInfo.domain}
                </div>
                <div className="text-xs text-gray-400">{systemInfo.ip}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          w-80 bg-gray-900 min-h-screen border-r border-gray-700
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-6">
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-gray-300 hover:bg-gray-800"
            >
              <X size={20} />
            </button>

            {/* System Info Card */}
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">
                SYSTEM INFORMATION
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">OS:</span>
                  <span className="text-white font-medium">
                    {systemInfo.os}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Core:</span>
                  <span className="text-white font-medium">
                    {systemInfo.cores}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RAM:</span>
                  <span className="text-white font-medium">
                    {systemInfo.ramUsed} / {systemInfo.ramTotal} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU Load:</span>
                  <span className="text-white font-medium">
                    {systemInfo.cpuLoad}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Uptime:</span>
                  <span className="text-white font-medium">
                    {systemInfo.uptime}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">
                INFORMATION ACCOUNT
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">SSH/OPENVPN/UDP:</span>
                  <span className="text-white font-medium">{accounts.ssh}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">VMESS/WS/GRPC:</span>
                  <span className="text-white font-medium">
                    {accounts.vmess}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">VLESS/WS/GRPC:</span>
                  <span className="text-white font-medium">
                    {accounts.vless}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">TROJAN/WS/GRPC:</span>
                  <span className="text-white font-medium">
                    {accounts.trojan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SHADOW/WS/GRPC:</span>
                  <span className="text-white font-medium">
                    {accounts.shadowsocks}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-3">
                SERVICE STATUS
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(services).map(([key, service]) => (
                  <div
                    key={key}
                    className={`p-2 rounded border ${getServiceBg(service.status)} ${service.status === "ON" ? "border-green-600" : "border-red-600"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 uppercase font-medium">
                        {key}
                      </span>
                      <span
                        className={`font-bold ${getServiceColor(service.status)}`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                Control Panel
              </h2>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className="bg-gray-900 border border-gray-700 p-4 rounded-lg hover:bg-gray-800 hover:border-blue-500 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center group-hover:bg-blue-800/70 transition-colors border border-blue-700">
                        <item.icon size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {item.category}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* System Monitoring Charts */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  System Monitoring
                </h3>

                {/* CPU Usage Chart */}
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Cpu className="mr-2 text-blue-400" size={20} />
                      CPU Usage & Temperature
                    </h4>
                    <div className="text-sm text-gray-400">Last 30 minutes</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cpuData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="time"
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="cpu"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="CPU (%)"
                          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="temperature"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name="Temp (°C)"
                          dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RAM Usage Chart */}
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <HardDrive className="mr-2 text-green-400" size={20} />
                      RAM Usage
                    </h4>
                    <div className="text-sm text-gray-400">
                      Used / Available (MB)
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ramData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="time"
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="used"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.3}
                          strokeWidth={2}
                          name="Used (MB)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bandwidth Chart */}
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Activity className="mr-2 text-purple-400" size={20} />
                      Network Bandwidth
                    </h4>
                    <div className="text-sm text-gray-400">
                      Download / Upload (Mbps)
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bandwidthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="time"
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <YAxis
                          stroke="#9CA3AF"
                          tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                            borderRadius: "6px",
                            color: "#F9FAFB",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="download"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="Download (Mbps)"
                          dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="upload"
                          stroke="#F59E0B"
                          strokeWidth={2}
                          name="Upload (Mbps)"
                          dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
