import { ResponsiveBar } from "@nivo/bar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    height: 600,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));
const TotalInfectionBarChart = ({ data, title, caption, bottomLegend, LeftLegend, ...rest }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" gutterBottom>
        {caption}
      </Typography>
      <ResponsiveBar
        data={data}
        {...rest}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        padding={0.3}
        groupMode="grouped"
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: bottomLegend,
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: LeftLegend,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        label={(d) => (d.value ? `${d.value} ${d.value > 1 ? "People" : "Person"}` : null)}
      />
    </Paper>
  );
};
export default TotalInfectionBarChart;
