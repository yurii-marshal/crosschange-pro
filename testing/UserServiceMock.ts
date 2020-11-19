import { Observable, of } from 'rxjs';
import { Rank,  SsoUser } from 'shared-kuailian-lib';
import { KycStatus } from 'shared-kuailian-lib';
import { TwoFactorMethodTypes } from 'shared-kuailian-lib';

export class UserServiceMock {

  getUserInfo(refresh?: boolean): Observable<SsoUser> {
    return of({
      email: '',
      id: 1,
      is_activation_fee_paid: false,
      is_adult: false,
      name: '',
      rank: 'starter' as Rank,
      kyc_status: KycStatus.declined,
      permissions: [],
      switches: {
        restore_password: false,
        kyc: false,
        kyc_identity_mind: false,
        remember_me: false,
        user_reports: false,
        show_masternodes_app: false,
        show_monthly_invoices: false,
        show_affiliates_report: false,
        show_contracts_report: false,
        show_rank_info: false,
        kbank_enabled: false,
        show_pool_monitoring: false,
        two_factor_auth: false,
        show_risk_licenses: false,
        realtime_monitoring: false,
        show_academy: false,
        show_purpose: false,
        show_ripple: false,
        show_marketplace: false,
        show_crosschange_pro: false,
        high_risk_licence_enabled: false,
        show_company: false,
        show_referral_tree: false,
        show_referral_tree_search: false,
        withdraw_app: false,
      },
      username: '',
      uuid: '',
      ws_token: '',
      zendesk_token: '',
      kyc_days_left: 1,
      is_old_user: false,
      crosschange_kyc_days_left: 1,
      two_factor_method: TwoFactorMethodTypes.EMAIL
    });
  }
}
