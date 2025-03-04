import { GeneralStatus } from "@/enum/generalStatus";
import { RegisterStatus } from "@/enum/registerStatus";
import { registerModel } from "@/models/register";
import { errorEmbed, testEmbed } from "@/views/general";
import { welcomeSetupEmbed } from "@/views/register";

export class registerController {
    static async newUser({ userID }: { userID: string }) {
        const registerStatus = await registerModel.addNewUser({ userID: userID })
        if (registerStatus === GeneralStatus.databaseError) return errorEmbed;
        if (registerStatus === RegisterStatus.userRegisteredSuccessfully) return welcomeSetupEmbed;
        return testEmbed
    }
}
