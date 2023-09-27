import { clientStatus  } from "../websockets/status.js";


class AccessTokenError extends Error {
}

class ProtocolError extends Error {
}

class InvalidFrame extends ProtocolError {
    status_code = clientStatus.PARSING_ERROR
}

class UnexpectedJSONInterface extends ProtocolError {
    status_code = clientStatus.UNEXPECTED_INTERFACE
}

class CodeNotAllowed extends ProtocolError {}

export { 
    AccessTokenError,
    ProtocolError,
    InvalidFrame,
    UnexpectedJSONInterface,
    CodeNotAllowed,
};