import type {DefinedVideo} from '../shared/defineVideo';
import californiaVsTexas from './california-vs-texas';
import chiPhiOTo from './chi-phi-o-to';
import duHocMyChiPhi from './du-hoc-my-chi-phi';
import giaDinh4Nguoi from './gia-dinh-4-nguoi';
import khamBenhOMy from './kham-benh-o-my';
import luong4000Usd from './luong-4000-usd';
import luongCaoKhoTietKiem from './luong-cao-kho-tiet-kiem';
import songOMy1Thang from './song-o-my-1-thang';
import songOMyPhongSu from './song-o-my-phong-su';

/** Thêm video mới: tạo thư mục trong src/videos/ rồi import vào danh sách này. */
export const videos: DefinedVideo[] = [khamBenhOMy, duHocMyChiPhi, chiPhiOTo, luongCaoKhoTietKiem, giaDinh4Nguoi, californiaVsTexas, luong4000Usd, songOMyPhongSu, songOMy1Thang];
