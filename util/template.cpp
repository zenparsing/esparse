struct CodePointRange { 

    Uint32 start;
    Uint16 length;
    Uint16 flags;
};

const CodePointRange whitespaceRanges[/**[WhiteSpaceDataLength]**/] = { 
/**[WhiteSpaceData]**/
};

const CodePointRange identifierRanges[/**[IdentifierDataLength]**/] = { 
/**[IdentifierData]**/
};

bool rangeListContains(

    const CodePointRange array[], 
    int right, 
    Uint16 flags, 
    Uint32 value) {

    int left = 0;
    Uint32 start;
    const CodePointRange* range;
    
    while (left <= right) {

        int mid = (left + right) >> 1;
        range = &array[mid];
        start = range->start;
        
        if (value > start) left = mid + 1;
        else if (value < start) right = mid -1;
        else return flags == 0 || (range->flags & flags) != 0;
    }
    
    range = &array[right];
    
    return 
        (value <= range->start + range->length) && 
        (flags == 0 || (range->flags & flags) != 0);
}

bool isIdentifierStart(Uint32 code) {

    return rangeListContains(
        identifierRanges, 
        sizeof(identifierRanges) / sizeof(CodePointRange) - 1, 
        1, 
        code);
}

bool isIdentifierPart(Uint32 code) {

    return rangeListContains(
        identifierRanges, 
        sizeof(identifierRanges) / sizeof(CodePointRange) - 1, 
        0, 
        code);
}

bool isWhitespaceChar(Uint32 code) {

    return rangeListContains(
        whitespaceRanges, 
        sizeof(whitespaceRanges) / sizeof(CodePointRange) - 1, 
        0, 
        code);
}