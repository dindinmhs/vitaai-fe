import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("../layouts/auth.tsx",[
        index("routes/login.tsx"),
        route("/register", "routes/register.tsx"), 
        route("/verify-message", "routes/verify-message.tsx"), 
        route("/verify", "routes/verify-email.tsx"), 
    ]),
    layout("../layouts/protected.tsx", [
        route("/chat", "routes/chat.tsx"),
        route("/chat/:conversationId", "routes/chat.$conversationId.tsx"),
        route("/admin", "routes/admin.tsx"),
        route("/admin/:id", "routes/admin.$id.tsx")
    ])
] satisfies RouteConfig;