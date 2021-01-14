import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import absoluteUrl from "next-absolute-url";
import utils from "../lib/utils";
import LogOutFab from "../Components/LogOutFab";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    placeContent: "center",
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  cardContainer: {
    alignSelf: "center",
    textAlign: "center",
  },
  card: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  },
  img: {
    borderRadius: "50%",
    width: 180,
    height: 180,
    objectFit: "cover",
    objectPosition: "center center",
  },
}));

const landingData = [
  {
    key: 0,
    text: "TTN Report",
    imgSrc: "/virus.svg",
    linkTo: "/self-report",
  },
  {
    key: 1,
    text: "Dashboard",
    imgSrc: "/admin.svg",
    linkTo: "/dashboard",
  },
];

export default function Home({ isLoggedIn }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container className={classes.cardContainer} spacing={3}>
        <Grid item xs={false} sm={1} md={2} lg={3} xl={4} />

        {landingData.map(({ key, text, imgSrc, linkTo }) => (
          <Grid item xs={12} sm={5} md={4} lg={3} xl={2} key={key}>
            <Link href={linkTo}>
              <Paper elevation={3} className={classes.card}>
                <Box mb={3}>
                  <img src={imgSrc} className={classes.img} />
                </Box>
                <Typography variant="h5" color="primary">
                  {text}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
        <Grid item xs={false} sm={1} md={2} lg={3} xl={4} />
      </Grid>
      {isLoggedIn && <LogOutFab />}
    </div>
  );
}

Home.getInitialProps = async ({ req, res }) => {
  const cookie = req?.headers.cookie;
  const { origin } = absoluteUrl(req);
  const [status] = await utils.handlePost(
    `${origin}/api/verifyUserRole`,
    {
      roleIs: "admin",
    },
    cookie
  );

  const props = {
    isLoggedIn: false,
  };

  if (status === 401) {
    utils.moveToLocation(
      res,
      "/?needsAuth=true&msg=You need to reauthenticate before accessing any of the services"
    );
    return props;
  }

  if (status === 200 || status === 404) {
    console.log(`User is logged in`);
    props.isLoggedIn = true;
  }
  return props;
};
