import utils from "../lib/utils";
import absoluteUrl from "next-absolute-url";
import TotalBarChart from "../Components/TotalBarChart";
import InfectionRates from "../Components/InfectionRates";
import PositiveDistribution from "../Components/PositiveDistribution";
import LogOutFab from "../Components/LogOutFab";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import My404 from "../Components/404";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    [theme.breakpoints.up("lg")]: {
      flexDirection: "row",
      flexWrap: "wrap",

      "& > *": {
        flexBasis: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        minWidth: "35%",

        "&:last-child": {
          minWidth: "80%",
          maxWidth: "95%",
        },
      },
    },
  },
  header: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
}));

export default function DashBoard({ data = {}, invalidRole, isLoggedIn }) {
  if (invalidRole) {
    return <My404 isLoggedIn={isLoggedIn} />;
  }

  const allEmptyArrays = (...args) => args.every((el) => !el.length);
  const allEmptyCases = (cases = {}) => Object.keys(cases).every((el) => !el.cases);
  const { byResultCount, byPositiveAgeGroup, byPositivePostCode } = data;

  const showCharts = !allEmptyArrays(byPositiveAgeGroup, byPositivePostCode);
  const showBarChart = !allEmptyCases(byResultCount);

  if (!showCharts && !showBarChart) {
    // no data to display show our custom 404 page instead
    const overrides = {
      errorTitle: "No Data Available",
      errorText: "Dashboard will be shown when data is available",
      noLogout: true,
      otherButtonRoute: "/self-report",
      button: {
        href: "/self-report",
        text: "Report TTTN",
      },
      imgPath: "/404_no_data.svg",
    };
    return <My404 overrideDefaults={overrides} />;
  }

  const classes = useStyles();

  return (
    <>
      <Container className={classes.header}>
        <Typography variant="h4" color="primary" gutterBottom>
          DashBoard
        </Typography>
        <Typography variant="caption" gutterBottom>
          Note: Infection/Positive Distrubtion Rate will display nothing if no recorded positive
          result
        </Typography>
      </Container>
      <div className={classes.root}>
        <PositiveDistribution
          data={byPositiveAgeGroup}
          id="ageGroup"
          value="totalInfected"
          title="Positive Distribution: Age Groups"
          caption="Figure below shows the number of infected people per age group"
        />
        <PositiveDistribution
          data={byPositivePostCode}
          id="postcode"
          value="totalInfected"
          title="Positive Distribution: Post Code"
          caption="Figure below shows the number of infected people per postcode"
        />
        <InfectionRates
          data={byPositiveAgeGroup}
          title="Infection Rate: Age Group"
          caption="Figure below shows the infection rate by postcode (Infected in Age Group / Total Infected)"
          id="ageGroup"
          value="infectionRate"
        />
        <InfectionRates
          data={byPositivePostCode}
          title="Infection Rate: Post Code"
          caption="Figure below shows the infection rate by postcode (Infected in PostCode / Total Infected)"
          id="postcode"
          value="infectionRate"
        />
        <TotalBarChart
          data={byResultCount}
          keys={["cases"]}
          indexBy="type"
          LeftLegend="Total"
          bottomLegend="TTN Result"
          colors={{ scheme: "accent" }}
          title="Total Case Count"
        />
      </div>
      <LogOutFab />
    </>
  );
}

DashBoard.getInitialProps = async ({ req, res }) => {
  const cookie = req?.headers.cookie;
  const { origin } = absoluteUrl(req);
  const [statusFromRoleCheck] = await utils.handlePost(
    `${origin}/api/verifyUserRole`,
    {
      roleIs: "admin",
    },
    cookie
  );

  if (statusFromRoleCheck === 404) {
    // the user is logged in but not an admin
    console.log(`dashboard status from verifyUserRole = `, statusFromRoleCheck);
    return {
      invalidRole: true,
      isLoggedIn: true,
    };
  } else if (statusFromRoleCheck === 401) {
    // the user has not logged in or no cookies present
    utils.moveToLocation(
      res,
      "/?needsAuth=true&msg=You need to authenticate before accessing any of the services"
    );
    return {
      invalidRole: true,
      isLoggedIn: false,
    };
  }
  // statusFromRoleCheck is 200 and so we can fetch the user data..
  const [, data] = await utils.handleGet(`${origin}/api/dashboard?mode=aggregate`, cookie);

  return { ...data, invalidRole: false };
};
