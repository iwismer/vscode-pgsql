/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import PgConstants from '../globalConstants';
import { CompletionItem, TextDocument, Position, CompletionItemKind, CompletionItemProvider, CancellationToken } from 'vscode';


import { CompletionEntry, CompletionsRequestArgs, CompletionsResponse, CompletionDetailsRequestArgs, CompletionDetailsResponse, CompletionEntryDetails } from '../protocol';


class MyCompletionItem extends CompletionItem {

	document: TextDocument;
	position: Position;

	constructor(entry: CompletionEntry) {
		super(entry.name);
		this.sortText = entry.sortText;
		this.kind = MyCompletionItem.convertKind(entry.kind);
	}

	private static convertKind(kind: string): CompletionItemKind {
		

		return CompletionItemKind.Property;
	}
}

export default class PostgresqlCompletionItemProvider implements CompletionItemProvider {

	public triggerCharacters = ['.', ' '];
	public excludeTokens = ['string', 'comment', 'numeric'];
	public sortBy = [{ type: 'reference', partSeparator: '/' }];
    private pgKeywords = [];

	constructor() {
        let constants = PgConstants.keywords;
        for (var constIdx = 0; constIdx < constants.length; constIdx++) {
            var element = this.createKeywordCompletionItem(constants[constIdx]);
            this.pgKeywords.push(element);
            
        }
	}

    private createKeywordCompletionItem(keyword: string)
    {
        var item = new CompletionItem(keyword);
        item.kind = CompletionItemKind.Keyword
        return item;
    }
	public provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Promise<CompletionItem[]> {
		let filepath = document.uri;
        let line = position.line + 1;
		let offset = position.character + 1;
        
		if (!filepath) {
			return Promise.resolve<CompletionItem[]>([]);
		}
        var testKeywords = this.pgKeywords;
		return Promise.resolve<CompletionItem[]>(testKeywords); ;
	}

	public resolveCompletionItem(item: CompletionItem, token: CancellationToken): any | Thenable<any> {
		return item;

		
	}
}