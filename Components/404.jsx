import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core";
import NextLink from "next/link";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    placeContent: "center",
    overflow: "hidden",
    backgroundColor: "#f2f2f2",
  },
  container: {
    alignSelf: "center",
    textAlign: "center",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  imgContainer: {
    marginBottom: theme.spacing(2),
  },
  img: {
    width: "auto",
    height: 200,
    objectFit: "cover",
    objectPosition: "center center",
  },
  linksContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    "& a": {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontSize: "1rem",
      color: theme.palette.secondary.main,

      "&:first-child": {
        paddingRight: theme.spacing(3),
        borderRight: "1px solid #333",
      },
    },
  },
  link: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

export default function My404({ isLoggedIn, overrideDefaults = {} }) {
  const classes = useStyles();
  const errorText =
    overrideDefaults.errorText ||
    (isLoggedIn
      ? `This page is only for administrators`
      : `You must authenticate Before Using This page`);
  const loginButtonState = overrideDefaults.button || {
    href: isLoggedIn ? "/logout" : "/login",
    text: isLoggedIn ? "Log Out" : "Login",
  };

  const onActionClick = async () => {
    if (!isLoggedIn) {
      Router.push(loginButtonState.href);
      return;
    }

    if (overrideDefaults.noLogout) {
      Router.push(loginButtonState.href);
      return;
    }
    console.log(`logging user out`);
    await fetch("/api/logout");
    Router.push("/?loggedOut=true");
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="xs" className={classes.container}>
        <Box className={classes.imgContainer}>
          <img src={overrideDefaults.imgPath || `/404.svg`} className={classes.img} />
        </Box>
        <Typography variant="h4" color="secondary" gutterBottom>
          {overrideDefaults.errorTitle || "Unauthorized Access"}
        </Typography>
        <Typography variant="body1">{errorText}</Typography>
        <Box className={classes.linksContainer}>
          <NextLink href="/home">Home</NextLink>
          <Link className={classes.link} onClick={onActionClick}>
            {loginButtonState.text}
          </Link>
        </Box>
      </Container>
    </div>
  );
}
