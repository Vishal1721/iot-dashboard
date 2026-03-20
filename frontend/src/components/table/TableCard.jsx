"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/time-functions";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Button } from "../ui/button1";
import { Trash2, Download, Search, ChevronUp, ChevronDown } from "lucide-react";

const TableCard = ({ sensorData, sensors, handleDelete }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("ascending");
  const [data, setData] = useState([]);
  const itemsPerPage = 10;

  const columns = [
    {
      key: "sensorName",
      label: "Sensor Name",
      isRowHeader: true,
      allowsSorting: true,
    },
    { key: "sensorType", label: "Type", allowsSorting: true },
    { key: "value", label: "Value" },
    { key: "timestamp", label: "Timestamp", allowsSorting: true },
    { key: "status", label: "Status", allowsSorting: true },
    { key: "actions", label: "Actions" },
  ];

  useEffect(() => {
    const formattedData = sensorData.flat().map((dataPoint) => {
      const sensor = sensors.find((s) => s.id === dataPoint.sensorId);
      const formattedTimestamp = formatDate(dataPoint.timestamp);
      const isOnline =
        formattedTimestamp.includes("minute") ||
        formattedTimestamp.includes("Just now");
      return {
        id: dataPoint.id || `${dataPoint.sensorId}-${dataPoint.timestamp}`,
        sensorName: sensor ? sensor.name : "Unknown",
        sensorType: sensor ? sensor.type.toLowerCase() : "Unknown",
        value: dataPoint.value,
        timestamp: formattedTimestamp,
        status: isOnline ? "Online" : "Offline",
        sensorId: sensor?.id,
        projectId: sensor?.projectId,
      };
    });
    setData(formattedData);
    handleSort("timestamp");
  }, [sensorData, sensors]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(
        sortDirection === "ascending" ? "descending" : "ascending",
      );
    } else {
      setSortColumn(column);
      setSortDirection("ascending");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    const first = a[sortColumn]?.toString().toLowerCase() || "";
    const second = b[sortColumn]?.toString().toLowerCase() || "";
    const comparison = first.localeCompare(second, undefined, {
      numeric: true,
    });
    return sortDirection === "ascending" ? comparison : -comparison;
  });

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sensor Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "sensor_data.xlsx");
  };

  if (!sensorData?.length || !sensors?.length) return null;

  return (
    <>
      <style>{`
        .table-outer {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .table-outer:hover {
          border-color: rgba(255,255,255,0.13) !important;
        }
        .th-sort:hover {
          background: rgba(255,255,255,0.05);
        }
        .tr-row {
          transition: background 0.15s ease;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .tr-row:hover {
          background: rgba(79,110,247,0.07) !important;
        }
        .tr-row:nth-child(even) {
          background: rgba(255,255,255,0.02);
        }
        .delete-btn {
          transition: color 0.15s ease, background 0.15s ease, transform 0.15s ease;
          border-radius: 6px;
          padding: 4px;
        }
        .delete-btn:hover {
          color: #f87171 !important;
          background: rgba(248,113,113,0.14);
          transform: scale(1.18);
        }
        .search-input:focus {
          border-color: rgba(79,110,247,0.55) !important;
          box-shadow: 0 0 0 3px rgba(79,110,247,0.13) !important;
          outline: none !important;
        }
        .download-btn {
          background: linear-gradient(135deg, #4f6ef7 0%, #6c8fff 100%);
          box-shadow: 0 4px 14px rgba(79,110,247,0.3);
          transition: all 0.2s ease;
        }
        .download-btn:hover {
          box-shadow: 0 6px 20px rgba(79,110,247,0.5);
          transform: translateY(-1px);
        }
        .page-btn {
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .page-btn:hover:not(:disabled) {
          background: rgba(79,110,247,0.15);
          border-color: rgba(79,110,247,0.4);
          color: #8aabff;
        }
        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>

      <div className="w-full overflow-auto lg:px-16 pb-6">
        <div
          className="table-outer rounded-xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, #1e2235 0%, #181b28 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          }}
        >
          {/* Blue accent bar */}
          <div
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, #4f6ef7 0%, rgba(79,110,247,0) 100%)",
            }}
          />

          {/* Header row */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-white font-bold text-base">
                Sensor Data Table
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {filteredData.length} record
                {filteredData.length !== 1 ? "s" : ""}
                {searchTerm ? ` matching "${searchTerm}"` : " total"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input w-48 text-sm text-white placeholder:text-gray-600 rounded-lg pl-8 pr-3 py-2"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                />
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="download-btn flex items-center gap-1.5 text-white font-semibold px-4 py-2 rounded-lg text-sm"
              >
                <Download size={13} />
                Export Excel
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              {/* Table head */}
              <thead>
                <tr
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 select-none ${col.allowsSorting ? "th-sort cursor-pointer" : ""}`}
                      onClick={() => col.allowsSorting && handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        {col.allowsSorting && (
                          <span
                            className="flex flex-col"
                            style={{ lineHeight: 0 }}
                          >
                            <ChevronUp
                              size={10}
                              style={{
                                color:
                                  sortColumn === col.key &&
                                  sortDirection === "ascending"
                                    ? "#8aabff"
                                    : "rgba(255,255,255,0.2)",
                              }}
                            />
                            <ChevronDown
                              size={10}
                              style={{
                                color:
                                  sortColumn === col.key &&
                                  sortDirection === "descending"
                                    ? "#8aabff"
                                    : "rgba(255,255,255,0.2)",
                              }}
                            />
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-14 text-gray-600 text-sm"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item) => (
                    <tr key={item.id} className="tr-row">
                      <td className="px-4 py-3 text-white font-medium">
                        {item.sensorName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(79,110,247,0.13)",
                            border: "1px solid rgba(79,110,247,0.2)",
                            color: "#8aabff",
                          }}
                        >
                          {item.sensorType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-mono">
                        {item.value}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {item.timestamp}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
                          style={
                            item.status === "Online"
                              ? {
                                  background: "rgba(34,197,94,0.13)",
                                  border: "1px solid rgba(34,197,94,0.25)",
                                  color: "#4ade80",
                                }
                              : {
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  color: "#6b7280",
                                }
                          }
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background:
                                item.status === "Online"
                                  ? "#4ade80"
                                  : "#4b5563",
                            }}
                          />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(item)}
                          className="delete-btn text-gray-600 cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="page-btn px-4 py-1.5 text-sm text-gray-400 rounded-lg"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Previous
            </button>

            <span className="text-xs text-gray-500">
              Page{" "}
              <span className="text-white font-semibold">{currentPage}</span> of{" "}
              <span className="text-white font-semibold">{totalPages}</span>
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-btn px-4 py-1.5 text-sm text-gray-400 rounded-lg"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TableCard;
