import { Router } from "express";
import { logOutUser, loginUser, registerUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();
router.route("/register").post(
    upload.fields([ // middleware
        {name:"avatar",
        maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser); 

    router.route("/login").post(loginUser)
    //securedROutes
    router.route("/logout").post(verifyJWT ,logOutUser);

export default router;