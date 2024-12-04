import React from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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

const SliderComponent = ({
  category,
  scores,
  handleSliderChange,
  handleSliderChangeCommitted,
}) => {
  return (
    <Box mt={4} width="100%">
      <Typography variant="h6" gutterBottom style={{ fontFamily: "Bokor" }}>
        {category}
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {Object.entries(scores).map(([subcat, score], subIndex) => (
          <Box
            key={subcat}
            display="flex"
            flexDirection="column"
            gap={1}
            width="100%"
          >
            <Typography variant="body2" style={{ fontFamily: "Bokor" }}>
              {subcat}
            </Typography>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Slider
                value={score}
                max={100}
                step={1}
                onChange={(event, value) =>
                  handleSliderChange(category, subcat, value)
                }
                onChangeCommitted={(event, value) =>
                  handleSliderChangeCommitted(category, subcat, value)
                }
                style={{
                  flexGrow: 1,
                  color: COLORS[category][subIndex % COLORS[category].length],
                }}
              />
              <Typography
                variant="body2"
                style={{ width: 48, textAlign: "right", fontFamily: "Bokor" }}
              >
                {score}%
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SliderComponent;
