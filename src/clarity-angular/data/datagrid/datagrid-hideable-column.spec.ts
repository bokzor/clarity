import { Component, TemplateRef, ViewChild } from "@angular/core";
import { TestContext } from "./helpers.spec";
import { DatagridColumn } from "./datagrid-column";
import { FiltersProvider } from "./providers/filters";
import { Sort } from "./providers/sort";
import { DatagridRenderOrganizer } from "./render/render-organizer";
import { DragDispatcher } from "./providers/drag-dispatcher";
import { DomAdapter } from "./render/dom-adapter";
import { DatagridHideableColumn } from "./datagrid-hideable-column";

const PROVIDERS_NEEDED = [Sort, FiltersProvider, DatagridRenderOrganizer, DomAdapter, DragDispatcher];


export default function (): void {
    describe("DatagridHideableColumn", function () {
        let context: TestContext<DatagridColumn, SimpleTest>;
        let testDgHideableColumn: DatagridHideableColumn;

        beforeEach(function () {
            context = this.create(DatagridColumn, SimpleTest, PROVIDERS_NEEDED);
            testDgHideableColumn = new DatagridHideableColumn(context.testComponent.templateRef,
                context.testComponent.id, context.testComponent.hidden);
        });

        it("should have a template ref", function () {
            expect(testDgHideableColumn.template).toBeDefined();
            expect(testDgHideableColumn.template).toEqual(jasmine.any(TemplateRef));
        });

        it("should have an id", function () {
            expect(testDgHideableColumn.id).toBe("dg-col-0");
        });

        it("should have a hidden flag default to true", function () {
            expect(testDgHideableColumn.hidden).toBeDefined();
            expect(testDgHideableColumn.hidden).toBe(true);
        });

        it("should allow hidden flag to be set", function () {
            expect(testDgHideableColumn.hidden).toBe(true);
            testDgHideableColumn.hidden = false;
            expect(testDgHideableColumn.hidden).toBe(false);
        });

        it("should provide an observable for the hidden changes", function () {
            let changeValue: boolean;
            let nbChanges: number = 0;

            testDgHideableColumn.hiddenChangeState.subscribe(change => {
                nbChanges++;
                changeValue = change;
            });

            testDgHideableColumn.hidden = false;
            expect(changeValue).toBe(false);
            expect(nbChanges).toEqual(1);

            testDgHideableColumn.hidden = true;
            expect(changeValue).toBe(true);
            expect(nbChanges).toEqual(2);
        });

        it("only updates hidden with a new value", function () {
            let changeValue: boolean;
            let nbChanges: number = 0;

            testDgHideableColumn.hiddenChangeState.subscribe(change => {
                nbChanges++;
                changeValue = change;
            });

            testDgHideableColumn.hidden = true;
            expect(changeValue).toBeUndefined();
            expect(nbChanges).toBe(0);
        });

    });
}

@Component({
    template: `
        <!-- NOTE: The column is needed to make TestContext happy. TODO: Remove when TestContext is more flexible. -->
        <clr-dg-column>Test Column</clr-dg-column>
        <ng-template #testRef>
            Hideable Column
        </ng-template>
    `
})

class SimpleTest  {
    @ViewChild("testRef") templateRef: TemplateRef<any>;
    id: string = "dg-col-0";
    hidden: boolean;
}
