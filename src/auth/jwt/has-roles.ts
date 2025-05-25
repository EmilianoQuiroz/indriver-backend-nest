import { SetMetadata } from "@nestjs/common";
import { JwtRol } from "./jwt-rol";

export const HasRoles = (...roles: JwtRol[]) => SetMetadata('roles', roles); 