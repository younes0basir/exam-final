<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    /**
     * Get available languages
     */
    public function getLanguages()
    {
        $languages = [
            [
                'code' => 'fr',
                'name' => 'Français',
                'native_name' => 'Français',
                'flag' => '🇫🇷',
                'direction' => 'ltr',
            ],
            [
                'code' => 'en',
                'name' => 'English',
                'native_name' => 'English',
                'flag' => '🇬🇧',
                'direction' => 'ltr',
            ],
            [
                'code' => 'ar',
                'name' => 'Arabic',
                'native_name' => 'العربية',
                'flag' => '🇸🇦',
                'direction' => 'rtl',
            ],
        ];

        return response()->json([
            'languages' => $languages,
            'current' => App::getLocale(),
        ]);
    }

    /**
     * Set application language
     */
    public function setLanguage(Request $request)
    {
        $request->validate([
            'locale' => 'required|in:fr,en,ar',
        ]);

        $locale = $request->input('locale');
        
        // Set Laravel locale
        App::setLocale($locale);
        
        // Store in session for persistence
        Session::put('locale', $locale);
        
        // Also set cookie for frontend
        $response = response()->json([
            'success' => true,
            'message' => 'Language changed successfully',
            'locale' => $locale,
        ]);

        return $response;
    }

    /**
     * Get translations for frontend
     */
    public function getTranslations($locale = null)
    {
        $locale = $locale ?? App::getLocale();
        
        // Load common translations
        $translations = trans('common', [], $locale);
        
        return response()->json([
            'locale' => $locale,
            'translations' => $translations,
        ]);
    }
}
