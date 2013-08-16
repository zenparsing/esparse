#include <iostream>

typedef unsigned short Uint16;
typedef unsigned int Uint32;

#include "unicode.cpp"

int main() {

    std::cout << "Ascii letters are identifier start " <<
        (isIdentifierStart('a') ? "[OK]" : "[FAIL]") <<
        std::endl;
    
    std::cout << "Ascii letters are identifier part " <<
        (isIdentifierPart('a') ? "[OK]" : "[FAIL]") <<
        std::endl;

    std::cout << "Numbers are not identifier start " <<
        (!isIdentifierStart('0') ? "[OK]" : "[FAIL]") <<
        std::endl;
    
    std::cout << "Numbers are identifier part " <<
        (isIdentifierPart('0') ? "[OK]" : "[FAIL]") <<
        std::endl;
    
}