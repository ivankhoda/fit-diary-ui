import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { plansController } from '../../../../controllers/global';

import './ActivePlanWidget.style.scss';
import { CurrentWorkoutDayInfo } from './CurrentWorkoutDay';
import { PlanHeader } from './PlanHeader';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import UserStore from '../../../../store/userStore';
import PlansStore from '../../../../store/plansStore';

type Props = {
    userStore?: UserStore;
    plansStore?: PlansStore;
};

const ActivePlanWidgetComponent: React.FC<Props> = ({ userStore, plansStore }) => {
    const activePlans = plansStore?.activeStatusPlans ?? [];
    const currentUser = userStore?.currentUser;

    useEffect(() => {
        if (currentUser?.active_plan?.plan_id && !plansStore?.currentPlan) {
            plansController.getPlans();
        }
    }, [currentUser?.active_plan?.plan_id, plansStore?.currentPlan]);

    console.log('Active plans to display:', activePlans);
    if (!activePlans.length) {return null;}

    return (
        <div className="active-plan-widget">
            <h3 className="widget-title">Активные планы</h3>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={15}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation
                className="plan-swiper"
            >
                {activePlans.map(plan => (
                    <SwiperSlide key={plan.id}>
                        <div className="plan-info">
                            <PlanHeader name={plan.name} description={plan.description} />
                            <CurrentWorkoutDayInfo
                                day={plan.current_workout_day}
                                planId={plan.id}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export const ActivePlanWidget = inject('userStore', 'plansStore')(observer(ActivePlanWidgetComponent));
