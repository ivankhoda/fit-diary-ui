/* eslint-disable no-magic-numbers */
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { plansStore, userStore } from '../../../../store/global';
import { plansController } from '../../../../controllers/global';

import './ActivePlanWidget.style.scss';
import { CurrentWorkoutDayInfo } from './CurrentWorkoutDay';
import { PlanHeader } from './PlanHeader';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const ActivePlanWidget = observer((): React.JSX.Element | null => {
    // Для теста: если у вас пока только один план, делаем массив из одного
    const activePlans = plansStore.activeStatusPlans ? plansStore.activeStatusPlans : [];
    const { userProfile } = userStore;

    useEffect(() => {
        if (userProfile?.active_plan?.plan_id && !plansStore.currentPlan) {
            plansController.getPlanDetails(userProfile.active_plan.plan_id);
            plansController.getPlans();
        }
    }, [userProfile?.active_plan?.plan_id, plansStore.currentPlan]);

    if (!activePlans.length) {
        return null;
    }

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
                            <CurrentWorkoutDayInfo day={plan.current_workout_day} planId={plan.id} />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
});
