import { Injectable } from "@angular/core";
import { UserBackendService } from "./user-core/user-backend.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import * as UserActions from "./user.actions";
import { map, exhaustMap, catchError, switchMap, tap } from "rxjs/operators";
import { Action } from "@ngrx/store";
import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { NewInboxDocumentsCountDto } from "@helper/abstraction/documents";
import { DownloadFileService } from "./documents/downloadFile.service";

@Injectable()
export class UserEffects {
	public getRoles$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getRoles),
		exhaustMap(() => this.backendService.authenticate.roles.list.get$().pipe(
			map((roles): Action => UserActions.getRolesSuccess(roles)),
			catchError((error): Observable<Action> => of(UserActions.getRolesError(error)))
		))
	));

	public getRolesSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getRolesSuccess),
		map(action => UserActions.setRoles(action.roles))
	));

	public getProfileAndOrganization$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.setRoles),
		switchMap(() => of(UserActions.getProfile(), UserActions.getOrganization())),
	));

	public getProfile$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getProfile),
		exhaustMap((): Observable<Action> => this.backendService.user.profile.get$().pipe(
			map((userProfile): Action => UserActions.getProfileSuccess(userProfile)),
			catchError((error): Observable<Action> => of(UserActions.getProfileError(error)))
		))
	));

	public getProfileSuccess$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getProfileSuccess),
		tap(profile => localStorage.setItem("isShowRememberMe", JSON.stringify(profile.userProfile.rememberLogin)))
	), { dispatch: false });

	public getOrganization$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getOrganization),
		exhaustMap((): Observable<Action> => this.backendService.organization.get$().pipe(
			map((organizationInfo): Action => UserActions.getOrganizationSuccess(organizationInfo)),
			catchError((error): Observable<Action> => of(UserActions.getOrganizationError(error)))
		))
	));

	public getNewInboxDocumentsCount = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getNewInboxDocumentsCount),
		exhaustMap(() => this.backendService.statistic.messagesCount.get$().pipe(
			map((value: NewInboxDocumentsCountDto): Action => UserActions.setNewInboxDocumentsCount({
				EWAYBILL: value.newEwaybillMessagesNumber,
				DESADV: value.newDesadvMessagesNumber,
				ORDERS: value.newOrdMessagesNumber,
			})),
			catchError((err: HttpErrorResponse): Observable<Action> => of(UserActions.getNewInboxDocumentsCountError(err)))
		))
	));

	public restoreUserPassword = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.restoreUserPassword),
		exhaustMap((action) => this.backendService.user.restorePassword.put$(action.email).pipe(
			map(() => UserActions.restoreUserPasswordSuccess()),
			catchError((error): Observable<Action> => of(UserActions.restoreUserPasswordError(error)))
		))
	));

	public exportXMLDocuments$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.exportXMLDocuments),
		exhaustMap((action): Observable<Action> => this.backendService.documents.downloadArchive.post$(action.params.documentIds, action.params.documentType, "XML").pipe(
			map((value: HttpResponse<Blob>): Action => {
				const content: string | null = value.headers.get("content-disposition");
				if (value.body && content) {
					const file = content.split("=")[1].split(".");
					return UserActions.exportXMLDocumentsSuccess({
						data: value.body,
						name: file[0],
						extension: file[1]
					});
				} else {
					return UserActions.exportXMLDocumentsError({ name: "no-file", message: "No File" });
				}
			}),
			catchError((err) => of(UserActions.exportXMLDocumentsError(err)))
		))
	));

	public exportXLSXDocuments$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.exportXLSXDocuments),
		exhaustMap((action): Observable<Action> => this.backendService.export.createFormatDocument.post$(action.params.documentIds, action.params.documentType).pipe(
			map((value: HttpResponse<Blob>): Action => {
				const content: string | null = value.headers.get("content-disposition");
				if (value.body && content) {
					const file = content.split("=")[1].split(".");
					return UserActions.exportXLSXDocumentsSuccess({
						data: value.body,
						name: file[0],
						extension: file[1]
					});
				} else {
					return UserActions.exportXLSXDocumentsError({ name: "no-file", message: "No File" });
				}
			}),
			catchError((err: Error) => of(UserActions.exportXLSXDocumentsError(err)))
		))
	));

	public createRegistry$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.createRegistry),
		exhaustMap((action): Observable<Action> => this.backendService.export.сreateRegistry.post$(action.id).pipe(
			map((value: HttpResponse<Blob>): Action => {
				const content: string | null = value.headers.get("content-disposition");
				if (value.body && content) {
					const file = content.split("=")[1].split(".");
					return UserActions.createRegistrySuccess({
						data: value.body,
						name: file[0],
						extension: file[1],
					});
				} else {
					return UserActions.createRegistryError({ name: "no-file", message: "No File" });
				}
			}),
			catchError((err: Error) => of(UserActions.createRegistryError(err)))
		))
	));

	public getStatisticsOrdersXLSX$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getStatisticsOrdersXLSX),
		exhaustMap((action): Observable<Action> => this.backendService.export.statisticOrdersWithRelations.post$(action.statisticFilterParams).pipe(
			map((value: HttpResponse<Blob>): Action => this.handleStatisticFile(value)),
			catchError((err: Error) => of(UserActions.getStatisticsXLSXError(err)))
		))
	));

	public getStatisticsEwaybillXLSX$ = createEffect((): Observable<Action> => this.actions$.pipe(
		ofType(UserActions.getStatisticsEwaybillXLSX),
		exhaustMap((action): Observable<Action> => this.backendService.export.ewaybillList.post$(action.statisticFilterParams, "XLSX").pipe(
			map((value: HttpResponse<Blob>): Action => this.handleStatisticFile(value)),
			catchError((err: Error) => of(UserActions.getStatisticsXLSXError(err)))
		))
	));

	public downloadFile$ = createEffect((): Observable<any> => this.actions$.pipe(
		ofType(UserActions.exportXMLDocumentsSuccess, UserActions.exportXLSXDocumentsSuccess, UserActions.createRegistrySuccess, UserActions.getStatisticsXLSXSuccess),
		map((value) => this.downloadFileService.download(value.file.data, value.file.name, value.file.extension))
	), { dispatch: false });


	constructor(
		private readonly actions$: Actions,
		private readonly backendService: UserBackendService,
		private readonly downloadFileService: DownloadFileService
	) { }

	public handleStatisticFile(value: HttpResponse<Blob>): Action {
		const content: string | null = value.headers.get("content-disposition");
		if (value.body && content) {
			const filename = content.split("=")[1];
			const i = filename.lastIndexOf(".");
			const name = filename.slice(0, i);
			const extension = filename.slice(i + 1);
			return UserActions.getStatisticsXLSXSuccess({
				data: value.body,
				name,
				extension
			});
		} else {
			return UserActions.getStatisticsXLSXError({ name: "no-file", message: "No File" });
		}
	}
}
