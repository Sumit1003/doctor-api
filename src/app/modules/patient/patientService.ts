import httpStatus from "http-status";
import ApiError from "../../../errors/apiError";
import prisma from "../../../shared/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from 'bcrypt';

export const create = async (payload: any): Promise<any> => {
    try {
        const data = await prisma.$transaction(async (tx) => {
            const { password, email,...othersData } = payload;

            const existEmail = await tx.auth.findUnique({ where: { email: email } });
            var patient: any;
            
                // Check Email existing
              
                console.log({existEmail})
                if (existEmail) {
                    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Email Already Exist !!")
                } else {
                     const auth  = await tx.auth.create({
                        data: {
                            email: email,
                            password:  await bcrypt.hashSync(password, 12),
                            role: UserRole.patient,
                        },
                       
                    });
                    return {
                        patient,
                        auth,
                    };
                }
            
        });

        return data;
    } catch (error: any) {
        throw new ApiError(httpStatus.BAD_REQUEST, error.message)
    }
};