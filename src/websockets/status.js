const clientStatus = {
    // client codes (no error)
    HEAD_TEXT_EOC: 701,
    HEAD_TEXT_MCE: 711,
    MORE_TEXT_EOC: 702,
    MORE_TEXT_MCE: 712,
    FILE_METADATA: 723,
    HEAD_FILE_EOC: 704,
    HEAD_FILE_MCE: 714,
    MORE_FILE_EOC: 705,
    MORE_FILE_MCE: 715,
    ACKNOWLEDGMENT: 726,
    MESSAGE_STATUS: 727,

    // client codes (error)
    UNKNOWN_KEY: 921,
    PARSING_ERROR: 922,
    UNEXPECTED_INTERFACE: 923,
}

const serverStatus = {
    // server codes (no error)
    HEAD_TEXT_EOC: 601,
    HEAD_TEXT_MCE: 611,
    MORE_TEXT_EOC: 602,
    MORE_TEXT_MCE: 612,
    FILE_DATA: 623,
    ACKNOWLEDGMENT: 624,
    MESSAGE_STATUS: 625,
    MESSAGE_REQUEST: 626,

    // server codes (error)
    UNKNOWN_KEY: 821,
    PARSING_ERROR: 822,
    UNEXPECTED_INTERFACE: 823,
    FILE_ERROR: 824,
    INTERNAL_ERROR: 825,
    INVALID_DATA: 826,
};

export { clientStatus, serverStatus }
