import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import CameraComponent from './Camara';
import BlazePoseComponent from './BlazePose';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from './../../../store/constant';

//-----------------------|| DEFAULT DASHBOARD ||-----------------------//

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={10} md={8}>
                        <CameraComponent />
                    </Grid>
                    <Grid item xs={6} md={4} spacing={gridSpacing}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={8} md={12}>
                                 <EarningCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={8} md={12} spacing={gridSpacing}>
                                 <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item xs={10} md={12} spacing={gridSpacing}>
                                 <TotalOrderLineChartCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
