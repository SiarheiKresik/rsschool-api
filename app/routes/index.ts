import * as Router from 'koa-router';
import { ILogger } from '../logger';

import { guardMiddleware } from './guardMiddleware';

import { authRoute } from './auth';
import { courseRouter } from './course';
import { coursesRouter } from './courses';
import { eventRouter } from './event';
import { healthRouter } from './health';
import { sessionRouter } from './session';
import { userRouter } from './user';

type RoutesMiddleware = (logger: ILogger) => Router;

function applyRouter(topRouter: Router, router: Router) {
    topRouter.use(router.routes());
    topRouter.use(router.allowedMethods());
}

export const routesMiddleware: RoutesMiddleware = () => {
    const router = new Router();

    applyRouter(router, healthRouter());
    applyRouter(router, authRoute());
    applyRouter(router, sessionRouter());

    router.use(guardMiddleware);

    // Requires authentication
    applyRouter(router, userRouter());
    applyRouter(router, courseRouter());
    applyRouter(router, coursesRouter());
    applyRouter(router, eventRouter());

    return router;
};
