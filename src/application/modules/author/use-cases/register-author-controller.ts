import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterAuthorUseCase } from "./register-author-use-case";

interface RegisterAuthorControllerRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export class RegisterAuthorController {
    async handle(
        req: Request<nonValuable, nonValuable, RegisterAuthorControllerRequest>,
        res: Response
    ): Promise<Response> {
        const registerAuthorUseCase = container.resolve(RegisterAuthorUseCase);

        const { confirmPassword, email, name, password } = req.body;

        const { author, token } = await registerAuthorUseCase.execute({
            confirmPassword,
            email,
            name,
            password,
        });

        return res.status(201).json({
            author,
            token,
        });
    }
}
