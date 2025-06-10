import React, { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import BusinessService from "../../api/services/business";

Chart.register(...registerables);

const MonthlyBusinessChart = () => {
  const chartContainerRef = useRef(null);
  const chartInstance = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BusinessService.getBusinessesByDate();
        setData(response.data.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navegação entre meses
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  // Renderizar gráfico
  useEffect(() => {
    if (!data || !chartContainerRef.current) return;

    const renderChart = () => {
      try {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const dailyCounts = allDays.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");

          return {
            date: dayStr,
            count: data.filter((b) => {
              const utcDate = parseISO(b.createdAt);
              const localDate = new Date(
                utcDate.getTime() + new Date().getTimezoneOffset() * 60000
              );
              const localDateStr = format(localDate, "yyyy-MM-dd");
              return localDateStr === dayStr;
            }).length,
          };
        });

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        let canvas = chartContainerRef.current.querySelector("canvas");
        if (!canvas) {
          canvas = document.createElement("canvas");
          chartContainerRef.current.appendChild(canvas);
        }

        const ctx = canvas.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: dailyCounts.map((item) =>
              format(new Date(item.date), "dd/MM", { locale: ptBR })
            ),
            datasets: [
              {
                label: "Estabelecimentos cadastrados",
                data: dailyCounts.map((item) => item.count),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
                borderColor: "rgba(59, 130, 246, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.parsed.y} estabelecimento(s)`,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  precision: 0,
                },
              },
            },
          },
        });
      } catch (err) {
        console.error("Erro ao renderizar gráfico:", err);
        setError("Erro ao renderizar gráfico");
      }
    };

    renderChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, currentMonth]);

  if (loading)
    return <div className="text-center py-8">Carregando gráfico...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Cadastros Mensais -{" "}
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            &lt;
          </button>
          <button
            onClick={handleCurrentMonth}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={
              format(currentMonth, "MM/yyyy") === format(new Date(), "MM/yyyy")
            }
          >
            Hoje
          </button>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            disabled={
              format(currentMonth, "MM/yyyy") === format(new Date(), "MM/yyyy")
            }
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="h-80 relative">
        <div ref={chartContainerRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default MonthlyBusinessChart;
