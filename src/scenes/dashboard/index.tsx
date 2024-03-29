import "dayjs/locale/it";
import React from "react";
import { Box, Typography, useTheme, Paper, Container } from "@mui/material";
import { useSelector } from 'react-redux';
import Header from "../../components/Header";
import CircularIndeterminate from "../../components/Circular";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PointOfSale } from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccessTimeFilledOutlinedIcon from "@mui/icons-material/AccessTimeFilledOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import LineChart from "../../components/LineChart";
import StateBox from "../../components/StateBox";
import ProgressCircle from "../../components/ProgressCircle";
import Grid from '@mui/system/Unstable_Grid';
import dayjs from "dayjs";
import { loadData } from "../../api";
import { convertHoursToHMS } from "../time"
import { calculateConstants, totalHours } from "../../components/utils";

// @ts-ignore
import AnimatedNumber from "animated-number-react";
import { motion } from "framer-motion";
import styled from '@mui/system/styled';


const Item = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems : "center",
  justifyContent : "center",
  height: '150px',
}));

const BigItem = styled(Paper)(({ theme }) => ({
  height: '250px',
  [theme.breakpoints.down('sm')]: {
    height: '300px'
  }
}));

const Dashboard = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => state.user);
  const [rows, setRows] = useState([]);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalYear, setTotalYear] = useState(0);
  const totalMonthHours = totalHours().month;
  const totalYearHours = totalHours().year;

  useEffect(() => {
    setLoading(true);
    const setData = async () => {
      try {
        const response = await loadData(user._id);
        setRows(response.rows);
        setTotalMonth(response.calculateTotalMonth);
        setTotalYear(response.calculateTotalYear);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    setData();
  }, []);

  const {
    PERCENTUAL_MONTH,
    PERCENTUAL_YEAR,
    ERNIN_HOUR_TOTAL,
    ERNIN_HOUR_YEAR,
    PERCENTUAL_ERN_MONTH,
    PERCENTUAL_ERN_YEAR,
  } = calculateConstants(totalMonth, totalMonthHours, totalYear, totalYearHours, user.earning_hour);

  const formatValue = (value: number) => value.toFixed(2);

  const gridItems = [
    {
      title: totalMonth,
      subtitle: 'Sum by Month',
      process: totalMonth,
      increase: `+${PERCENTUAL_MONTH}%`,
      icon: (
        <AccessTimeOutlinedIcon sx={{ fontSize: '26px', color: theme.palette.grey[500] }} />
      ),
    },
    {
      title: `${ERNIN_HOUR_TOTAL} $`,
      subtitle: 'Earning this Month',
      process: PERCENTUAL_ERN_MONTH || 0,
      increase: `+${PERCENTUAL_ERN_MONTH || 0}%`,
      icon: (
        <PointOfSale sx={{ color: theme.palette.grey[500], fontSize: '26px' }} />
      ),
    },
    {
      title: totalYear,
      subtitle: 'Sum by Year',
      process: PERCENTUAL_YEAR || 0,
      increase: `+${PERCENTUAL_YEAR || 0}%`,
      icon: (
        <AccessTimeFilledOutlinedIcon sx={{ color: theme.palette.grey[500], fontSize: '26px' }} />
      ),
    },
    {
      title: user.earning_hour,
      subtitle: 'Salary to Hourly',
      process: 50,
      increase: '+50%',
      icon: (
        <EuroOutlinedIcon sx={{ color: theme.palette.grey[500], fontSize: '26px' }} />
      ),
    },
  ];
  return (
    <Box
      m="20px"
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" />
      {loading ? <CircularIndeterminate /> : <Box display="flex" p="20px" />}
      </Box>

      <Grid container spacing={2} >
        {gridItems.map((item, index) => (
          <Grid key={index} xs={12} sm={6} md={3} lg={3}>
            <Item elevation={6}>
              <StateBox
                title={item.title}
                subtitle={item.subtitle}
                process={item.process}
                increase={item.increase}
                icon={item.icon}
              />
            </Item>
          </Grid>
        ))}
        <Grid xs={12} sm={6} md={6} lg={6}>
          <BigItem elevation={6}>
            <Typography sx={{
                  p: theme.spacing(1),
              }} variant="h5" fontWeight={600} color='GrayText'>
              Campingn
            </Typography>
      
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
        
              <ProgressCircle
                size="125"
                progressColor={theme.palette.secondary.main}
                progress={PERCENTUAL_ERN_YEAR}
              />
        
              <Typography
                variant="h5"
                color="success"
                sx={{
                  mt: theme.spacing(1),
                  textAlign: 'center'
                }}
              >
                $&nbsp;
          
                <AnimatedNumber value={ERNIN_HOUR_YEAR} formatValue={formatValue} />
                &nbsp;Revenue gerated this year.
              </Typography>
              <Typography  color='secondary'>
                Inclides extra misc expenditures and cost
              </Typography>
            </Box>
        </BigItem >

        </Grid>
        <Grid xs={12} sm={6} md={6} lg={6}>
        <BigItem elevation={6}>
          <Typography sx={{ padding: theme.spacing(1)}} color='GrayText' variant="h5" fontWeight={600}>
                Last sum by day created
          </Typography>
          <Box sx={{ height: '200px', overflow: 'auto' }}>
            <Box 
              display="flex"
              justifyContent="space-between"
              alignItems="end"
            >
            </Box>
            {rows.slice(Math.max(rows.length - 8, 0)).map((trasaction) => (
        
              <Box
                key={`${trasaction._id}`}
                display="flex"
                justifyContent='space-between '
                alignItems="center"
                p={theme.spacing(1)}
              >
                <Box>
                  <Typography >
                    {dayjs(trasaction.dateCreated)
                      .locale("it")
                      .format("DD-MM-YYYY")}
                  </Typography>
                </Box>
          
                <Box 
                color="primary" 
                fontSize="16px">
                  {`${trasaction.start.slice(0, 5)} - ${trasaction.end.slice(
                    0,
                    5
                  )}`}
                </Box>
          
                <Box
                  p="5px 10px"   
                >
                  <Typography color='secondary'>
                    {convertHoursToHMS(trasaction.total)}
                  </Typography>
                </Box>
              </Box>
            ))}

          </Box>
          
        </BigItem>
     
        </Grid>
        <Grid xs={12}>
              <Box
              mt={isNonMobile ? "0px" : "25px"}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
        
              <Box>
          
                <Typography variant="h5" fontWeight="600" color='GrayText'>
                  Revenue Generated
                </Typography>
          
                <Typography
                  variant="h4"
                  fontWeight="500"
                  color="secondary"
                >
                  Months sum of the year.
                </Typography>
              </Box>
            </Box>
          <Box
            sx={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              overflowY: "hidden",
            }}
          >
            <Box height="200px"  width={isNonMobile ? '100%' : "1000px"} m="0 0 0 0">
                <LineChart isDashboard={true} />
              </Box>
            </Box> 
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
