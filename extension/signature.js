const sigdatas = require('./signature-data').default

const parse = sd => {
    const regex = /\(([^)]+)\)/
    const matches = regex.exec( sd )
    if ( !matches ) return []
    if ( matches.length < 2 ) return []
    const sps = matches[1]
    return sps.split(",").map( sp => ({ label: sp }))
}

const signatures = sigdatas.map( sd => {
    if ( !sd ) return
    if ( sd.length < 2 ) return
    return {
        label: sd[0],
        documentation: sd[1],
        parameters: parse( sd[0] )
    }
})

exports.default = {
    provideSignatureHelp: ( doc, pos ) => {
        
        const text = doc.lineAt( pos.line ).text.substring( 0, pos.character )
        const parts = text.split("(") //text before and after (
        
        if ( !parts.length ) return Promise.resolve( null )
        
        const ftext = parts[0]
        const fwords = ftext.split(" ") 
        if ( !fwords.length ) return Promise.resolve( null )

        const fname = fwords[fwords.length-1]; // last word before '('
        if ( !fname ) return Promise.resolve( null )
                
        let activeParameter = 0
        if ( parts.length === 2 ){
            activeParameter = parts[1].split(",").length - 1
        }

        const mask = fname.toUpperCase()
        const filtered = signatures.filter( s => ~s.label.toUpperCase().indexOf( mask ) && ( s.parameters.length > activeParameter ) )
        return Promise.resolve( { activeParameter, activeSignature: 0, signatures: filtered } )

    }
}