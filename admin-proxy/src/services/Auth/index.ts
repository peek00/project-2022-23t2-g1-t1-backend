import { AuthenticationService } from "./AuthenticationService";
import { AuthorisationService } from "./AuthorisationService";
import { JwtService } from "./JwtService";

const authenticationService = AuthenticationService.getInstance();
const authorisationService = AuthorisationService.getInstance();
const jwtService = JwtService.getInstance();

export { jwtService, authenticationService, authorisationService };
