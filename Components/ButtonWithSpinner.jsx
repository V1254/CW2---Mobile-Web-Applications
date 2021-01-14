import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  spinner: {
    marginLeft: theme.spacing(1),
    color: '#fff'
  },
}));
export default function ButtonWithSpinner({ children, isLoading, ...otherProps }) {
  const classes = useStyles();
  return (
    <Button {...otherProps}>
      {isLoading ? <CircularProgress size={28} className={classes.spinner} /> : children}
    </Button>
  );
}
