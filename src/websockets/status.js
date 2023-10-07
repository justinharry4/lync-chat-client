const clientStatus = {
    // client codes (no error)
    // HEAD_TEXT_EOC: 701,
    // HEAD_TEXT_MCE: 711,
    // MORE_TEXT_EOC: 702,
    // MORE_TEXT_MCE: 712,
    TEXT_DATA: 701,
    FILE_METADATA: 722,
    HEAD_FILE_EOC: 703,
    HEAD_FILE_MCE: 713,
    MORE_FILE_EOC: 704,
    MORE_FILE_MCE: 714,
    ACKNOWLEDGMENT: 725,
    MESSAGE_STATUS: 726,

    // client codes (error)
    UNKNOWN_KEY: 921,
    PARSING_ERROR: 922,
    UNEXPECTED_INTERFACE: 923,
}

const serverStatus = {
    // server codes (no error)
    // HEAD_TEXT_EOC: 601,
    // HEAD_TEXT_MCE: 611,
    // MORE_TEXT_EOC: 602,
    // MORE_TEXT_MCE: 612,
    TEXT_DATA: 601,
    FILE_DATA: 622,
    ACKNOWLEDGMENT: 623,
    MESSAGE_STATUS: 624,
    MESSAGE_REQUEST: 625,

    // server codes (error)
    NOT_AUTHENTICATED: 820,
    UNKNOWN_KEY: 821,
    PARSING_ERROR: 822,
    UNEXPECTED_INTERFACE: 823,
    FILE_ERROR: 824,
    INTERNAL_ERROR: 825,
    INVALID_DATA: 826,
};

export { clientStatus, serverStatus }
