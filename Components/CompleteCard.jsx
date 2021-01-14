import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    placeContent: "center",
    overflow: "hidden",
  },
  container: {
    alignSelf: "center",
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    textAlign: "center",
  },
  img: {
    borderRadius: "50%",
    width: 180,
    height: 180,
    objectFit: "contain",
    objectPosition: "center center",
    [theme.breakpoints.only("xs")] : {
        width: 100,
        height: 100
    }
  },
  imgContainer: {
      marginBottom: theme.spacing(2)
  }
}));

const CompleteCard = ( { onReportAnother }) => {
  console.log(onReportAnother)
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="sm" className={classes.container}>
        <Paper elevation={3} className={classes.paper}>
          <div className={classes.imgContainer}>
            <img src="/complete.svg" className={classes.img} />
          </div>
          <Typography variant="body1" gutterBottom>
            Thank you for submitting your covid results. You may close this page now.
          </Typography>
          <Button color="primary" onClick={onReportAnother}>Report Another TTN?</Button>
        </Paper>
      </Container>
    </div>
  );
};

export default CompleteCard;
