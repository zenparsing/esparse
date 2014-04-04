// Unicode 6.2.0 | 2012-05-23, 20:34:59 GMT [MD]
var identifierStart = /[\x24\x41-\x5A\x5F\x61-\x7A\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    identifierPart = /[\x24\x30-\x39\x41-\x5A\x5F\x61-\x7A\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u036F\u0370-\u0374\u0376-\u0377\u037A-\u037D\u0386\u0387\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1-\u05C2\u05C4-\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u064A\u064B-\u0669\u066E-\u066F\u0670\u0671-\u06D3\u06D5\u06D6-\u06DC\u06DF-\u06E4\u06E5-\u06E6\u06E7-\u06E8\u06EA-\u06ED\u06EE-\u06EF\u06F0-\u06F9\u06FA-\u06FC\u06FF\u0710\u0711\u0712-\u072F\u0730-\u074A\u074D-\u07A5\u07A6-\u07B0\u07B1\u07C0-\u07C9\u07CA-\u07EA\u07EB-\u07F3\u07F4-\u07F5\u07FA\u0800-\u0815\u0816-\u0819\u081A\u081B-\u0823\u0824\u0825-\u0827\u0828\u0829-\u082D\u0840-\u0858\u0859-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0903\u0904-\u0939\u093A-\u093C\u093D\u093E-\u094F\u0950\u0951-\u0957\u0958-\u0961\u0962-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC\u09BD\u09BE-\u09C4\u09C7-\u09C8\u09CB-\u09CD\u09CE\u09D7\u09DC-\u09DD\u09DF-\u09E1\u09E2-\u09E3\u09E6-\u09EF\u09F0-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A3C\u0A3E-\u0A42\u0A47-\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A71\u0A72-\u0A74\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABC\u0ABD\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE1\u0AE2-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3C\u0B3D\u0B3E-\u0B44\u0B47-\u0B48\u0B4B-\u0B4D\u0B56-\u0B57\u0B5C-\u0B5D\u0B5F-\u0B61\u0B62-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55-\u0C56\u0C58-\u0C59\u0C60-\u0C61\u0C62-\u0C63\u0C66-\u0C6F\u0C82-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC\u0CBD\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5-\u0CD6\u0CDE\u0CE0-\u0CE1\u0CE2-\u0CE3\u0CE6-\u0CEF\u0CF1-\u0CF2\u0D02-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D4E\u0D57\u0D60-\u0D61\u0D62-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2-\u0DF3\u0E01-\u0E30\u0E31\u0E32-\u0E33\u0E34-\u0E3A\u0E40-\u0E46\u0E47-\u0E4E\u0E50-\u0E59\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB1\u0EB2-\u0EB3\u0EB4-\u0EB9\u0EBB-\u0EBC\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18-\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F3F\u0F40-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F87\u0F88-\u0F8C\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u102A\u102B-\u103E\u103F\u1040-\u1049\u1050-\u1055\u1056-\u1059\u105A-\u105D\u105E-\u1060\u1061\u1062-\u1064\u1065-\u1066\u1067-\u106D\u106E-\u1070\u1071-\u1074\u1075-\u1081\u1082-\u108D\u108E\u108F-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1712-\u1714\u1720-\u1731\u1732-\u1734\u1740-\u1751\u1752-\u1753\u1760-\u176C\u176E-\u1770\u1772-\u1773\u1780-\u17B3\u17B4-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18A8\u18A9\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u194F\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C0\u19C1-\u19C7\u19C8-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A17-\u1A1B\u1A20-\u1A54\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B04\u1B05-\u1B33\u1B34-\u1B44\u1B45-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1B83-\u1BA0\u1BA1-\u1BAD\u1BAE-\u1BAF\u1BB0-\u1BB9\u1BBA-\u1BE5\u1BE6-\u1BF3\u1C00-\u1C23\u1C24-\u1C37\u1C40-\u1C49\u1C4D-\u1C4F\u1C50-\u1C59\u1C5A-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CE9-\u1CEC\u1CED\u1CEE-\u1CF1\u1CF2-\u1CF4\u1CF5-\u1CF6\u1D00-\u1DBF\u1DC0-\u1DE6\u1DFC-\u1DFF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C-\u200D\u203F-\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CEF-\u2CF1\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u3029\u302A-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309A\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA620-\uA629\uA62A-\uA62B\uA640-\uA66E\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F\uA6A0-\uA6EF\uA6F0-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA802\uA803-\uA805\uA806\uA807-\uA80A\uA80B\uA80C-\uA822\uA823-\uA827\uA840-\uA873\uA880-\uA881\uA882-\uA8B3\uA8B4-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8F2-\uA8F7\uA8FB\uA900-\uA909\uA90A-\uA925\uA926-\uA92D\uA930-\uA946\uA947-\uA953\uA960-\uA97C\uA980-\uA983\uA984-\uA9B2\uA9B3-\uA9C0\uA9CF\uA9D0-\uA9D9\uAA00-\uAA28\uAA29-\uAA36\uAA40-\uAA42\uAA43\uAA44-\uAA4B\uAA4C-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAAF\uAAB0\uAAB1\uAAB2-\uAAB4\uAAB5-\uAAB6\uAAB7-\uAAB8\uAAB9-\uAABD\uAABE-\uAABF\uAAC0\uAAC1\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAEB-\uAAEF\uAAF2-\uAAF4\uAAF5-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uABE3-\uABEA\uABEC-\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33-\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    whitespaceChars = /[\x09\x0B-\x0C\x20\xA0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFEFF]/;

var identifierEscape = /\\u([0-9a-fA-F]{4})/g,
    newlineSequence = /\r\n?|[\n\u2028\u2029]/g;

// === Reserved Words ===
var reservedWord = new RegExp("^(?:" +
    "break|case|catch|class|const|continue|debugger|default|delete|do|" +
    "else|enum|export|extends|false|finally|for|function|if|import|in|" +
    "instanceof|new|null|return|super|switch|this|throw|true|try|typeof|" +
    "var|void|while|with" +
")$");

// === Punctuators ===
var multiCharPunctuator = new RegExp("^(?:" +
    "--|[+]{2}|" +
    "&&|[|]{2}|" +
    "<<=?|" +
    ">>>?=?|" +
    "[!=]==|" +
    "=>|" +
    "[\.]{2,3}|" +
    "[-+&|<>!=*&\^%\/]=" +
")$");

// === Miscellaneous Patterns ===
var octalEscape = /^(?:[0-3][0-7]{0,2}|[4-7][0-7]?)/,
    blockCommentPattern = /\r\n?|[\n\u2028\u2029]|\*\//g,
    hexChar = /[0-9a-f]/i;

// === Character type lookup table ===
function makeCharTable() {

    var table = [],
        i;
    
    for (i = 0; i < 128; ++i) table[i] = "";
    for (i = 65; i <= 90; ++i) table[i] = "identifier";
    for (i = 97; i <= 122; ++i) table[i] = "identifier";
    
    add("whitespace", "\t\v\f ");
    add("newline", "\r\n");
    add("decimal-digit", "123456789");
    add("punctuator-char", "{[]();,?:");
    add("punctuator", "<>+-*%&|^!~=");
    add("dot", ".");
    add("slash", "/");
    add("rbrace", "}");
    add("zero", "0");
    add("string", "'\"");
    add("template", "`");
    add("identifier", "$_\\");
    
    return table;
    
    function add(type, string) {
    
        string.split("").forEach(c => table[c.charCodeAt(0)] = type);
    }
}

var charTable = makeCharTable();

// Performs a binary search on an array
function binarySearch(array, val) {

    var right = array.length - 1,
        left = 0,
        mid,
        test;
    
    while (left <= right) {
        
        mid = (left + right) >> 1;
        test = array[mid];
        
        if (val === test)
            return mid;
        
        if (val < test) right = mid - 1;
        else left = mid + 1;
    }
    
    return left;
}

// Returns true if the character is a valid identifier part
function isIdentifierPart(c) {

    if (c > 127)
        return identifierPart.test(String.fromCharCode(c));
    
    return  c > 64 && c < 91 || 
            c > 96 && c < 123 ||
            c > 47 && c < 58 ||
            c === 36 ||
            c === 95 ||
            c === 92;
}

// Returns true if the specified character is a newline
function isNewlineChar(c) {

    switch (c) {
    
        case "\r":
        case "\n":
        case "\u2028":
        case "\u2029":
            return true;
    }
    
    return false;
}

// Returns true if the specified character can exist in a non-starting position
function isPunctuatorNext(c) {

    switch (c) {
    
        case "+":
        case "-":
        case "&":
        case "|":
        case "<":
        case ">":
        case "=":
        case ".":
            return true;
    }
    
    return false;
}

// Returns true if the specified character is a valid numeric following character
function isNumberFollow(c) {

    if (c > 127)
        return isNumberFollowUnicode(c);
    
    return !(
        c > 64 && c < 91 || 
        c > 96 && c < 123 ||
        c > 47 && c < 58 ||
        c === 36 ||
        c === 95 ||
        c === 92
    );
}

// Returns true if the specified character is a valid numeric following character
function isNumberFollowUnicode(c) {

    return !identifierStart.test(String.fromCharCode(c));
}

export class Scanner {

    constructor(input, offset) {

        this.input = input || "";
        this.offset = offset | 0;
        this.length = this.input.length;
        this.lines = [-1];
        this.lastLineBreak = -1;
        
        this.value = "";
        this.number = 0;
        this.regexFlags = "";
        this.templateEnd = false;
        this.newlineBefore = false;
        this.strictError = "";
        this.start = 0;
        this.end = 0;
    }
    
    skip() {
        
        return this.next("skip");
    }
    
    next(context) {

        if (this.type !== "COMMENT")
            this.newlineBefore = false;
        
        this.strictError = "";
        
        do {
        
            this.start = this.offset;
            
            this.type = 
                this.start >= this.length ? this.EOF() : 
                context === "skip" ? this.Skip() :
                this.Start(context);
        
        } while (!this.type)
        
        this.end = this.offset;
        
        return this.type;
    }
    
    raw(token) {
    
        return this.input.slice(token.start, token.end);
    }
    
    lineNumber(offset) {
    
        return binarySearch(this.lines, offset);
    }
    
    position(offset) {
    
        var line = this.lineNumber(offset),
            pos = this.lines[line - 1],
            column = offset - pos;
        
        return { line, column, lineOffset: pos + 1 };
    }
    
    addLineBreak(offset) {
    
        if (offset > this.lastLineBreak)
            this.lines.push(this.lastLineBreak = offset);
    }
    
    peekChar() {
    
        return this.input.charAt(this.offset);
    }
    
    peekCharAt(n) {
    
        return this.input.charAt(this.offset + n);
    }
    
    peekCode() {
    
        return this.input.charCodeAt(this.offset) | 0;
    }
    
    peekCodeAt(n) {
    
        return this.input.charCodeAt(this.offset + n) | 0;
    }
    
    readChar() {
    
        return this.input.charAt(this.offset++);
    }
    
    readUnicodeEscape() {
  
        var hex = "";
        
        if (this.peekChar() === "{") {
        
            this.offset++;
            hex = this.readHex(0);
            
            if (hex.length < 1 || this.readChar() !== "}")
                return null;
        
        } else {
        
            hex = this.readHex(4);
        
            if (hex.length < 4)
                return null;
        }
        
        var val = parseInt(hex, 16);
        
        if (val > 1114111)
            return null;
        
        return String.fromCharCode(val);
    }
    
    readOctalEscape() {
    
        var m = octalEscape.exec(this.input.slice(this.offset, this.offset + 3)),
            val = m ? m[0] : "";
        
        this.offset += val.length;
        
        return val;
    }
    
    readStringEscape() {
    
        this.offset++;
        
        var chr = "", 
            esc = "";
        
        switch (chr = this.readChar()) {
        
            case "t": return "\t";
            case "b": return "\b";
            case "v": return "\v";
            case "f": return "\f";
            case "r": return "\r";
            case "n": return "\n";
    
            case "\r":
            
                this.addLineBreak(this.offset - 1);
                
                if (this.peekChar() === "\n")
                    this.offset++;
                
                return "";
            
            case "\n":
            case "\u2028":
            case "\u2029":
            
                this.addLineBreak(this.offset - 1);
                return "";

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            
                this.offset--;
                esc = this.readOctalEscape();
                
                if (esc === "0") {
                
                    return String.fromCharCode(0);
                
                } else {
                
                    this.strictError = "Octal literals are not allowed in strict mode";
                    return String.fromCharCode(parseInt(esc, 8));
                }
            
            case "x":
            
                esc = this.readHex(2);
                return (esc.length < 2) ? null : String.fromCharCode(parseInt(esc, 16));
            
            case "u":
            
                return this.readUnicodeEscape();
            
            default: 
            
                return chr;
        }
    }
    
    readRange(low, high) {
    
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= low && code <= high) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    }
    
    readInteger() {
    
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= 48 && code <= 57) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    }
    
    readHex(maxLen) {
        
        var str = "", 
            chr = "";
        
        while (chr = this.peekChar()) {
        
            if (!hexChar.test(chr))
                break;
            
            str += chr;
            this.offset++;
            
            if (str.length === maxLen)
                break;
        }
        
        return str;
    }
    
    Skip() {
    
        var code = this.peekCode();
        
        if (code < 128) {
        
            switch (charTable[code]) {
        
                case "whitespace": return this.Whitespace(code);
            
                case "newline": return this.Newline(code);
            
                case "slash":
            
                    var next = this.peekCodeAt(1);

                    if (next === 47) return this.LineComment(code);       // /
                    else if (next === 42) return this.BlockComment(code); // *
            }
        
        } else {
        
            var chr = this.peekChar();
        
            // Unicode newlines
            if (isNewlineChar(chr))
                return this.Newline(code);
        
            // Unicode whitespace
            if (whitespaceChars.test(chr))
                return this.UnicodeWhitespace(code);
        }
        
        return "UNKNOWN";
    }
    
    Start(context) {
    
        var code = this.peekCode(), 
            next = 0;
        
        switch (charTable[code]) {
        
            case "punctuator-char": return this.PunctuatorChar();
            
            case "whitespace": return this.Whitespace();
            
            case "identifier": return this.Identifier(context);
            
            case "rbrace":
            
                if (context === "template") return this.Template();
                else return this.PunctuatorChar();
            
            case "punctuator": return this.Punctuator();
            
            case "newline": return this.Newline(code);
            
            case "decimal-digit": return this.Number();
            
            case "template": return this.Template();
            
            case "string": return this.String();
            
            case "zero": 
            
                switch (next = this.peekCodeAt(1)) {
                
                    case 88: case 120: return this.HexNumber();   // x
                    case 66: case 98: return this.BinaryNumber(); // b
                    case 79: case 111: return this.OctalNumber(); // o
                }
                
                return next >= 48 && next <= 55 ?
                    this.LegacyOctalNumber() :
                    this.Number();
            
            case "dot": 
            
                next = this.peekCodeAt(1);
                
                if (next >= 48 && next <= 57) return this.Number();
                else return this.Punctuator();
            
            case "slash":
            
                next = this.peekCodeAt(1);

                if (next === 47) return this.LineComment();       // /
                else if (next === 42) return this.BlockComment(); // *
                else if (context === "div") return this.Punctuator();
                else return this.RegularExpression();
            
        }
        
        var chr = this.peekChar();
        
        // Unicode newlines
        if (isNewlineChar(chr))
            return this.Newline(code);
        
        // Unicode whitespace
        if (whitespaceChars.test(chr))
            return this.UnicodeWhitespace();
        
        // Unicode identifier chars
        if (identifierStart.test(chr))
            return this.Identifier(context);
        
        return this.Error();
    }
    
    Whitespace() {
    
        this.offset++;
        
        var code = 0;
        
        while (code = this.peekCode()) {
        
            // ASCII Whitespace:  [\t] [\v] [\f] [ ] 
            if (code === 9 || code === 11 || code === 12 || code === 32)
                this.offset++;
            else
                break;
        }
        
        return "";
    }
    
    UnicodeWhitespace() {
    
        this.offset++;
        
        // General unicode whitespace
        while (whitespaceChars.test(this.peekChar()))
            this.offset++;
        
        return "";
    }
    
    Newline(code) {
        
        this.addLineBreak(this.offset++);
        
        // Treat /r/n as a single newline
        if (code === 13 && this.peekCode() === 10)
            this.offset++;
        
        this.newlineBefore = true;
        
        return "";
    }
    
    PunctuatorChar() {
    
        return this.readChar();
    }
    
    Punctuator() {
        
        var op = this.readChar(), 
            chr = "",
            next = "";
        
        while (
            isPunctuatorNext(chr = this.peekChar()) &&
            multiCharPunctuator.test(next = op + chr)) {
    
            this.offset++;
            op = next;
        }
        
        // ".." is not a valid token
        if (op === "..") {
        
            this.offset--;
            op = ".";
        }
        
        return op;
    }
    
    Template() {
    
        var first = this.readChar(),
            end = false, 
            val = "", 
            esc = "",
            chr = "";
        
        while (chr = this.peekChar()) {
            
            if (chr === "`") {
            
                end = true;
                break;
            }
            
            if (chr === "$" && this.peekCharAt(1) === "{") {
            
                this.offset++;
                break;
            }
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (!esc) 
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        this.value = val;
        this.templateEnd = end;
        
        return "TEMPLATE";
    }
    
    String() {
    
        var delim = this.readChar(),
            val = "",
            esc = "",
            chr = "";
        
        while (chr = this.input[this.offset]) {
        
            if (chr === delim)
                break;
            
            if (isNewlineChar(chr))
                return this.Error();
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (esc === null)
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        this.value = val;
        
        return "STRING";
    }
    
    RegularExpression() {
    
        this.offset++;
        
        var backslash = false, 
            inClass = false,
            flags = "",
            flagStart = 0,
            val = "", 
            chr = "",
            code = 0;
        
        while (chr = this.readChar()) {
        
            if (isNewlineChar(chr))
                return this.Error();
            
            if (backslash) {
            
                val += "\\" + chr;
                backslash = false;
            
            } else if (chr === "[") {
            
                inClass = true;
                val += chr;
            
            } else if (chr === "]" && inClass) {
            
                inClass = false;
                val += chr;
            
            } else if (chr === "/" && !inClass) {
            
                break;
            
            } else if (chr === "\\") {
            
                backslash = true;
                
            } else {
            
                val += chr;
            }
        }
        
        if (!chr)
            return this.Error();
        
        flagStart = this.offset;
        
        while (isIdentifierPart(code = this.peekCode())) {
        
            // Unicode escapes are not allowed in regular expression flags
            if (code === 92)
                return this.Error();
            
            this.offset++;
        }
        
        if (this.offset > flagStart)
            flags = this.input.slice(flagStart, this.offset);
        
        this.value = val;
        this.regexFlags = flags;
        
        return "REGEX";
    }
    
    LegacyOctalNumber() {
    
        this.offset++;
        
        var start = this.offset,
            code = 0;
        
        while (code = this.peekCode()) {
        
            if (code >= 48 && code <= 55)
                this.offset++;
            else
                break;
        }
        
        this.strictError = "Octal literals are not allowed in strict mode";
        
        var val = parseInt(this.input.slice(start, this.offset), 8);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    }
    
    Number() {
    
        var start = this.offset,
            next = "";
        
        this.readInteger();
        
        if ((next = this.peekChar()) === ".") {
        
            this.offset++;
            this.readInteger();
            next = this.peekChar();
        }
        
        if (next === "e" || next === "E") {
        
            this.offset++;
            
            next = this.peekChar();
            
            if (next === "+" || next === "-")
                this.offset++;
            
            if (!this.readInteger())
                return this.Error();
        }
        
        var val = parseFloat(this.input.slice(start, this.offset));
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    }
    
    BinaryNumber() {
    
        this.offset += 2;
        
        var val = parseInt(this.readRange(48, 49), 2);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    }
    
    OctalNumber() {
    
        this.offset += 2;
        
        var val = parseInt(this.readRange(48, 55), 8);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    }
    
    HexNumber() {
    
        this.offset += 2;
        
        var val = parseInt(this.readHex(0), 16);
        
        if (!isNumberFollow(this.peekCode()))
            return this.Error();
        
        this.number = val;
        
        return "NUMBER";
    }
    
    Identifier(context) {
    
        var start = this.offset,
            startChar = true,
            id = "",
            code = 0,
            esc = "";

        while (true) {
        
            code = this.peekCode();
        
            if (code === 92 /* backslash */) {
            
                id += this.input.slice(start, this.offset++);
                
                if (this.readChar() !== "u")
                    return this.Error();
                
                esc = this.readUnicodeEscape();
                
                if (esc === null)
                    return this.Error();

                if (!(startChar ? identifierStart : identifierPart).test(esc))
                    return this.Error();
                
                id += esc;
                start = this.offset;
                
            } else if (startChar || isIdentifierPart(code)) {
            
                this.offset++;
                
            } else {
            
                break;
            }
            
            startChar = false;
        }
        
        id += this.input.slice(start, this.offset);
        
        if (context !== "name" && reservedWord.test(id))
            return id;
        
        this.value = id;
        
        return "IDENTIFIER";
    }
    
    LineComment() {
    
        this.offset += 2;
        
        var start = this.offset,
            chr = "";
        
        while (chr = this.peekChar()) {
        
            if (isNewlineChar(chr))
                break;
            
            this.offset++;
        }
        
        this.value = this.input.slice(start, this.offset);
        
        return "COMMENT";
    }
    
    BlockComment() {
    
        this.offset += 2;
        
        var pattern = blockCommentPattern,
            start = this.offset,
            m = null;
        
        while (true) {
        
            pattern.lastIndex = this.offset;
            
            m = pattern.exec(this.input);
            if (!m) return this.Error();
            
            this.offset = m.index + m[0].length;
            
            if (m[0] === "*/")
                break;
            
            this.newlineBefore = true;
            this.addLineBreak(m.index);
        }
        
        this.value = this.input.slice(start, this.offset - 2);
        
        return "COMMENT";
    }
    
    EOF() {
    
        return "EOF";
    }
    
    Error() {
    
        this.offset++;
        return "ILLEGAL";
    }
    
}
