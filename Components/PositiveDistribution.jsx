import { ResponsivePie } from "@nivo/pie";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    height: 600,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default function PositiveDistribution({ data, title, caption, ...rest }) {
  const classes = useStyles();
  return (
    <Paper className={classes.root}>
      <Typography variant="h4" color="secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" gutterBottom>
        {caption}
      </Typography>
      <ResponsivePie
        {...rest}
        colors={{ scheme: "pastel2" }}
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#333333"
        radialLabelsLinkColor={{ from: "color" }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
        valueFormat={(number) => `${number} ${number > 1 ? "People" : "Person"}`}
      />
    </Paper>
  );
}
