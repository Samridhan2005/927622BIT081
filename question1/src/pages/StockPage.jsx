import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const timeIntervals = [5, 10, 30, 60];

const StockPage = () => {
  const [stocks, setStocks] = useState({});
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedInterval, setSelectedInterval] = useState(10);
  const [priceHistory, setPriceHistory] = useState([]);

  // Fetch list of all stocks once
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch("http://20.244.56.144/evaluation-service/stocks", {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN_HERE`, // Replace this with your actual token
          },
        });
        const data = await response.json();
        setStocks(data.stocks);
      } catch (error) {
        console.error("Error fetching stocks list:", error);
      }
    };

    fetchStocks();
  }, []);

  // Fetch price history when stock or interval changes
  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!selectedStock) return;

      try {
        const response = await fetch(
          `http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${selectedInterval}`,
          {
            headers: {
              Authorization: `Bearer YOUR_ACCESS_TOKEN_HERE`,
            },
          }
        );
        const data = await response.json();
        setPriceHistory(data);
      } catch (error) {
        console.error("Error fetching price history:", error);
      }
    };

    fetchPriceHistory();
  }, [selectedStock, selectedInterval]);

  const averagePrice =
    priceHistory.length > 0
      ? priceHistory.reduce((sum, item) => sum + item.price, 0) /
        priceHistory.length
      : 0;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Stock Price Viewer
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Choose Stock</InputLabel>
        <Select
          value={selectedStock}
          label="Choose Stock"
          onChange={(e) => setSelectedStock(e.target.value)}
        >
          {Object.entries(stocks).map(([name, symbol]) => (
            <MenuItem key={symbol} value={symbol}>
              {name} ({symbol})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Time Interval (minutes)</InputLabel>
        <Select
          value={selectedInterval}
          label="Time Interval (minutes)"
          onChange={(e) => setSelectedInterval(e.target.value)}
        >
          {timeIntervals.map((t) => (
            <MenuItem key={t} value={t}>
              Last {t} minutes
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box mt={4}>
        {priceHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="lastUpdatedAt"
                tickFormatter={(timeStr) =>
                  new Date(timeStr).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timeStr) =>
                  new Date(timeStr).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
                formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1976d2"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <ReferenceLine
                y={averagePrice}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: "Average",
                  position: "right",
                  fill: "red",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography mt={2}>
            Select a stock and interval to view price history.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StockPage;
