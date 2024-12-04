import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, Sector, Text } from "recharts";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import debounce from "lodash.debounce";
import SliderComponent from "./SliderComponent"; // Import the new SliderComponent

const COLORS = {
  "Social Connections": ["#FF5733", "#FF6F4A", "#FF8661", "#FF9D78"], // Arcane Red shades
  Career: ["#33FF57", "#4AFF6F", "#61FF86", "#78FF9D"], // Arcane Green shades
  "Personal Development": ["#3357FF", "#4A6FFF", "#6186FF", "#789DFF"], // Arcane Blue shades
  Finances: ["#FF33A1", "#FF4AB8", "#FF61CF", "#FF78E6"], // Arcane Pink shades
  "Mind & Spirit": ["#33FFF5", "#4AFFF6", "#61FFF7", "#78FFF8"], // Arcane Cyan shades
  "Health & Fitness": ["#FF8C33", "#FFA14A", "#FFB661", "#FFCB78"], // Arcane Orange shades
  Relationships: ["#8C33FF", "#A14AFF", "#B661FF", "#CB78FF"], // Arcane Purple shades
  Creativity: ["#FFD733", "#FFDD4A", "#FFE361", "#FFE978"], // Arcane Yellow shades
};

// Custom label component for the center text
const CenterLabel = () => {
  return (
    <>
      <text
        x={411.84} // 316.8 * 1.3
        y={411.84} // 316.8 * 1.3
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-current font-semibold text-lg"
        style={{ fontFamily: "Bokor" }}
      >
        Life Progress
      </text>
    </>
  );
};

const CategoryLabel = ({ cx, cy, midAngle, outerRadius, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="middle"
      className="fill-current text-sm font-medium"
      style={{ fontFamily: "Bokor" }}
    >
      {name}
    </text>
  );
};

const SubCategoryLabel = ({ cx, cy, midAngle, outerRadius, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="middle"
      className="fill-current text-xs font-medium"
      style={{ fontFamily: "Bokor" }}
    >
      {name}
    </text>
  );
};

const LifeProgressSunburst = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [scores, setScores] = useState({});
  const [sliderScores, setSliderScores] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/resources/life-progress-stats.json")
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
        setSliderScores(data);
      })
      .catch((error) =>
        console.error("Error fetching life progress stats:", error)
      );
  }, []);

  const createChartData = () => {
    const outerData = [];
    const innerData = [];

    Object.entries(scores).forEach(([category, subcategories], index) => {
      const categoryScore =
        Object.values(subcategories).reduce((a, b) => a + b, 0) /
        Object.keys(subcategories).length;
      const midAngle = index * 45 + 22.5;

      innerData.push({
        name: category,
        value: 100,
        actualScore: categoryScore,
        startAngle: index * 45,
        endAngle: (index + 1) * 45,
        midAngle: midAngle,
      });

      Object.entries(subcategories).forEach(([subcat, score], subIndex) => {
        const baseRadius = 274.56; // 211.2 * 1.3
        const maxAdditionalRadius = 102.96; // 79.2 * 1.3
        const additionalRadius = (score / 100) * maxAdditionalRadius;

        outerData.push({
          name: subcat,
          category: category,
          value: 100,
          outerRadius: baseRadius + additionalRadius,
          startAngle:
            index * 45 + subIndex * (45 / Object.keys(subcategories).length),
          endAngle:
            index * 45 +
            (subIndex + 1) * (45 / Object.keys(subcategories).length),
          color: COLORS[category][subIndex % COLORS[category].length],
        });
      });
    });

    return { outerData, innerData };
  };

  const { outerData, innerData } = createChartData();

  const saveScores = useCallback(
    debounce((updatedScores) => {
      fetch("http://localhost:3001/resources/life-progress-stats.json", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedScores),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save scores");
          }
        })
        .catch((error) => console.error("Error saving scores:", error));
    }, 500),
    []
  );

  const handleSliderChange = (category, subcategory, newValue) => {
    setSliderScores((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: newValue,
      },
    }));
  };

  const handleSliderChangeCommitted = (category, subcategory, newValue) => {
    const updatedScores = {
      ...scores,
      [category]: {
        ...scores[category],
        [subcategory]: newValue,
      },
    };
    setScores(updatedScores);
    saveScores(updatedScores);
  };

  const renderActiveCategory = () => {
    if (activeIndex === null) return null;
    const category = innerData[activeIndex]?.name;
    if (!category || !sliderScores[category]) return null;

    return (
      <SliderComponent
        category={category}
        scores={sliderScores[category]}
        handleSliderChange={handleSliderChange}
        handleSliderChangeCommitted={handleSliderChangeCommitted}
      />
    );
  };

  return (
    <Card style={{ width: "100%", maxWidth: "1560px", margin: "0 auto" }}>
      {" "}
      {/* 1200 * 1.3 */}
      <CardHeader
        title={
          <Typography variant="h4" style={{ fontFamily: "Bokor" }}>
            Life Progress Tracker
          </Typography>
        }
      />
      <CardContent>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Box position="relative">
            <PieChart width={823.68} height={823.68}>
              {" "}
              {/* 633.6 * 1.3 */}
              {/* Center Text */}
              <CenterLabel />
              {/* Custom outer rings for subcategories */}
              {outerData.map((entry, index) => (
                <Pie
                  key={index}
                  data={[entry]}
                  dataKey="value"
                  cx={411.84} // 316.8 * 1.3
                  cy={411.84} // 316.8 * 1.3
                  innerRadius={274.56} // 211.2 * 1.3
                  outerRadius={entry.outerRadius}
                  startAngle={entry.startAngle}
                  endAngle={entry.endAngle}
                >
                  <Cell fill={entry.color} opacity={0.8} />
                  <SubCategoryLabel
                    cx={411.84} // 316.8 * 1.3
                    cy={411.84} // 316.8 * 1.3
                    midAngle={(entry.startAngle + entry.endAngle) / 2}
                    outerRadius={entry.outerRadius}
                    name={entry.name}
                  />
                </Pie>
              ))}
              {/* Inner ring - main categories */}
              <Pie
                data={innerData}
                dataKey="value"
                cx={411.84} // 316.8 * 1.3
                cy={411.84} // 316.8 * 1.3
                innerRadius={171.6} // 132 * 1.3
                outerRadius={273} // 210 * 1.3
                startAngle={0}
                endAngle={360}
                onClick={(_, index) => setActiveIndex(index)}
              >
                {innerData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name][0]} // Use the first color for the main category
                    opacity={activeIndex === index ? 1 : 0.7}
                  />
                ))}
              </Pie>
              {/* Category Labels */}
              {innerData.map((entry, index) => (
                <CategoryLabel
                  key={`label-${index}`}
                  cx={411.84} // 316.8 * 1.3
                  cy={411.84} // 316.8 * 1.3
                  midAngle={entry.midAngle}
                  outerRadius={377.52} // 290.4 * 1.3
                  name={entry.name}
                />
              ))}
            </PieChart>
          </Box>

          <Box flex={1} width="100%">
            {renderActiveCategory()}
            {activeIndex === null && (
              <Typography color="textSecondary" style={{ fontFamily: "Bokor" }}>
                Click on a category to adjust scores
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LifeProgressSunburst;
