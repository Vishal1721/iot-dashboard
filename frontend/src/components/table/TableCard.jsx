"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/time-functions";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Button } from "../ui/button1";
import { Trash2 } from "lucide-react";

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
    { key: "sensorType", label: "Sensor Type", allowsSorting: true },
    { key: "value", label: "Value" },
    { key: "timestamp", label: "Timestamp", allowsSorting: true },
    { key: "status", label: "Status", allowsSorting: true },
    { key: "actions", label: "Actions" },
  ];

  useEffect(() => {
    const formattedData = sensorData.flat().map((dataPoint) => {
      const sensor = sensors.find((sensor) => sensor.id === dataPoint.sensorId);

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

  // Sorting function
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
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sensor_data.xlsx");
  };

  const ItemDelete = async (item) => {
    handleDelete(item);
  };

  return (
    <div className="w-full overflow-auto lg:px-16 pb-6">
      {sensorData?.length > 0 && sensors?.length > 0 && (
        <Card className="bg-white rounded-xl shadow-lg w-full px-4 border border-gray-200">
          <Card.Header className="flex items-center justify-between -mb-8 md:-mb-5">
            <Card.Title className="text-base sm:text-xl font-bold text-gray-800">
              Sensor Data Table
            </Card.Title>
          </Card.Header>
          <div className="py-4 flex justify-between items-center gap-2 sm:gap-5">
            <Input
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 bg-gray-50 text-gray-800 rounded-xl pl-5 h-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <Button
              onClick={handleDownload}
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Download as Excel
            </Button>
          </div>
          <Table
            allowResize
            aria-label="Live Sensor Data"
            className="rounded-lg shadow-sm w-full min-w-[600px] border border-gray-200"
          >
            <Table.Header className="bg-gradient-to-r from-blue-600 to-blue-800 w-full">
              {columns?.map((column) => (
                <Table.Column
                  key={column?.key}
                  isResizable
                  isRowHeader={column?.isRowHeader}
                  className={`text-white font-medium ${column?.allowsSorting ? "cursor-pointer" : ""}`}
                >
                  <div
                    onClick={() =>
                      column?.allowsSorting && handleSort(column?.key)
                    }
                    className={`cursor-pointer flex justify-between items-center px-2 py-2 ${column?.allowsSorting ? "hover:opacity-80" : ""}`}
                  >
                    {column?.label}
                    {sortColumn === column?.key && (
                      <span className="ml-1 text-white">
                        {sortDirection === "ascending" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body items={paginatedData}>
              {(item) => (
                <Table.Row
                  key={item?.id}
                  className="hover:bg-gray-100 border-b border-gray-200 even:bg-gray-50"
                >
                  <Table.Cell className="text-gray-700">
                    {item?.sensorName}
                  </Table.Cell>
                  <Table.Cell className="text-gray-700">
                    {item?.sensorType}
                  </Table.Cell>
                  <Table.Cell className="text-gray-700">
                    {item?.value}
                  </Table.Cell>
                  <Table.Cell className="text-gray-700">
                    {item?.timestamp}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item?.status === "Online"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item?.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Trash2
                      className="cursor-pointer text-red-500 hover:text-red-700 transition-all w-5 h-5"
                      onClick={() => ItemDelete(item)}
                    />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
          <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of{" "}
                {Math.ceil(filteredData.length / itemsPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredData.length / itemsPerPage),
                    ),
                  )
                }
                disabled={
                  currentPage === Math.ceil(filteredData.length / itemsPerPage)
                }
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TableCard;
