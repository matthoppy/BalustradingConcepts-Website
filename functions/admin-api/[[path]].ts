/**
 * /admin-api/* — the dashboard's API, deployed with the site. Everything is
 * in functions/_lib/admin.ts; this file only exists so Pages routes to it.
 */

import type { Env, PagesContext } from '../_lib/bindings';
import { handleAdmin } from '../_lib/admin';

export const onRequest = async ({ request, env }: PagesContext<Env>) => handleAdmin(request, env);
