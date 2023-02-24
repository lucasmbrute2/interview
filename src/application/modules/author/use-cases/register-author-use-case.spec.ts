import "reflect-metadata";
import { beforeEach, describe, expect, it, vitest } from "vitest";
import { makeUserInRequest } from "../factory/makeAuthorRequest";
import { InMemoryRepository } from "../repository/in-memory-author-repository";
import { RegisterAuthorUseCase } from "./register-author-use-case";
import { InMemoryRedisProvider } from "@shared/container/providers/RedisProvider/implementations/in-memory-redis-provider";
import { makeAuthor } from "../factory/makeAuthor";
import { BadRequestError } from "@shared/errors/app-error";

let authorRepository: InMemoryRepository;
let registerAuthorUseCase: RegisterAuthorUseCase;
let inMemoryRedisProvider: InMemoryRedisProvider;

describe("Register Author", () => {
    beforeEach(() => {
        inMemoryRedisProvider = new InMemoryRedisProvider();
        authorRepository = new InMemoryRepository();
        registerAuthorUseCase = new RegisterAuthorUseCase(
            authorRepository,
            inMemoryRedisProvider
        );
    });

    it("should be able to register an author", async () => {
        expect(async () => {
            const author = makeUserInRequest();
            await registerAuthorUseCase.execute(author);
        }).not.toThrow;
    });

    it("should not be able to register a user with a mismatching password", () => {
        expect(async () => {
            const author = makeUserInRequest();
            await registerAuthorUseCase.execute(author);
        }).rejects.toThrow;
    });

    it("should not be able to register a user thats already exists", () => {
        expect(async () => {
            const author = makeAuthor();
            await authorRepository.create(author);
            const email = authorRepository.authors[0].email;

            await registerAuthorUseCase.execute({
                email: email.value,
                confirmPassword: "Adkad!3131",
                password: "Adkad!3131",
                name: "lucas",
            });
        }).rejects.toBeInstanceOf(BadRequestError);
    });
});
