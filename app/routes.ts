import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("../layouts/auth.tsx",[
        index("routes/login.tsx"),
        route("/register", "routes/register.tsx"), 
        route("/verify-message", "routes/verify-message.tsx"), 
        route("/verify", "routes/verify-email.tsx"), 
    ]),
    route("/chat", "routes/chat.tsx") 
] satisfies RouteConfig;
