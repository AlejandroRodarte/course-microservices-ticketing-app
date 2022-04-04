import createRoute from '../../../../lib/api/create-route';
import handlers from '../../../../lib/api/health/healthz';

const route = createRoute();

route.get(handlers.get)

export default route.rootHandler;
